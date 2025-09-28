/**
 * Push APIs for Email and Calendar Integration
 * Handles Gmail drafts, Calendar events, and n8n webhook fallbacks
 */

import { getGmailClient, getCalendarClient } from './google';
import { trackEvent } from './analytics';

export interface EmailAttachment {
  filename: string;
  url: string;
}

export interface PushEmailResult {
  id?: string;
  provider: 'gmail' | 'n8n' | 'none';
}

export interface PushCalendarResult {
  id?: string;
  provider: 'calendar' | 'n8n' | 'none';
}

/**
 * Push email draft to Gmail or n8n webhook
 */
export async function pushEmailDraft(args: {
  userId: string;
  to: string;
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
}): Promise<PushEmailResult> {
  const { userId, to, subject, body, attachments = [] } = args;

  // Try Gmail if enabled and tokens available
  if (process.env.INTEGRATIONS_ENABLE_GMAIL === 'true') {
    try {
      const gmail = await getGmailClient(userId);
      
      // Create email message
      const message = createEmailMessage(to, subject, body, attachments);
      
      // Create draft
      const response = await gmail.users.drafts.create({
        userId: 'me',
        requestBody: {
          message: {
            raw: Buffer.from(message).toString('base64url'),
          },
        },
      });

      return {
        id: response.data.id,
        provider: 'gmail',
      };
    } catch (error) {
      console.warn('Gmail draft creation failed, falling back to webhook:', error);
    }
  }

  // Try n8n webhook fallback
  const webhookUrl = process.env.N8N_WEBHOOK_DRAFT;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          body,
          attachments,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          id: result.id,
          provider: 'n8n',
        };
      }
    } catch (error) {
      console.warn('n8n webhook failed:', error);
    }
  }

  return { provider: 'none' };
}

/**
 * Push calendar event to Google Calendar or n8n webhook
 */
export async function pushCalendarEvent(args: {
  userId: string;
  title: string;
  startISO: string;
  endISO?: string;
  description?: string;
  attendees?: string[];
}): Promise<PushCalendarResult> {
  const { userId, title, startISO, endISO, description, attendees = [] } = args;

  // Try Google Calendar if enabled and tokens available
  if (process.env.INTEGRATIONS_ENABLE_CALENDAR === 'true') {
    try {
      const calendar = await getCalendarClient(userId);
      
      const event = {
        summary: title,
        description,
        start: {
          dateTime: startISO,
          timeZone: 'UTC',
        },
        end: {
          dateTime: endISO || new Date(new Date(startISO).getTime() + 30 * 60 * 1000).toISOString(),
          timeZone: 'UTC',
        },
        attendees: attendees.map(email => ({ email })),
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      return {
        id: response.data.id,
        provider: 'calendar',
      };
    } catch (error) {
      console.warn('Google Calendar event creation failed, falling back to webhook:', error);
    }
  }

  // Try n8n webhook fallback
  const webhookUrl = process.env.N8N_WEBHOOK_CALENDAR;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          datetime: startISO,
          notes: description,
          attendees,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          id: result.id,
          provider: 'n8n',
        };
      }
    } catch (error) {
      console.warn('n8n webhook failed:', error);
    }
  }

  return { provider: 'none' };
}

/**
 * Create email message in RFC 2822 format
 */
function createEmailMessage(
  to: string,
  subject: string,
  body: string,
  attachments: EmailAttachment[]
): string {
  const boundary = `boundary_${Date.now()}`;
  let message = '';

  // Headers
  message += `To: ${to}\r\n`;
  message += `Subject: ${subject}\r\n`;
  message += `MIME-Version: 1.0\r\n`;
  message += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;

  // Body
  message += `--${boundary}\r\n`;
  message += `Content-Type: text/html; charset=UTF-8\r\n\r\n`;
  message += `${body}\r\n\r\n`;

  // Attachments (as links for now)
  for (const attachment of attachments) {
    message += `--${boundary}\r\n`;
    message += `Content-Type: text/plain; charset=UTF-8\r\n`;
    message += `Content-Disposition: attachment; filename="${attachment.filename}"\r\n\r\n`;
    message += `Link: ${attachment.url}\r\n\r\n`;
  }

  message += `--${boundary}--\r\n`;

  return message;
}

/**
 * Track email draft creation
 */
export async function trackEmailDraft(
  userId: string,
  result: PushEmailResult,
  attachmentCount: number
): Promise<void> {
  await trackEvent({
    userId,
    event: 'EMAIL_DRAFT_CREATED',
    metadata: {
      provider: result.provider,
      attachments: attachmentCount,
      draftId: result.id,
    },
  });
}

/**
 * Track calendar event creation
 */
export async function trackCalendarEvent(
  userId: string,
  result: PushCalendarResult
): Promise<void> {
  await trackEvent({
    userId,
    event: 'FOLLOWUP_SCHEDULED',
    metadata: {
      provider: result.provider,
      eventId: result.id,
    },
  });
}
