import { InterviewResponse } from '@/types/resume';

export interface NormalizedPdfModel {
  header: {
    name?: string;
    role?: string;
    contactLines: string[];
  };
  sections: Array<{
    title: string;
    bullets: string[];
    period?: string;
    subtitle?: string;
  }>;
}

export function normalizeForPdf(input: InterviewResponse & {
  fullName?: string;
  contact?: {
    email?: string;
    phone?: string;
    links?: string[];
  };
  targetRole?: string;
}): NormalizedPdfModel {
  // Build header
  const contactLines: string[] = [];
  if (input.contact?.email) contactLines.push(input.contact.email);
  if (input.contact?.phone) contactLines.push(input.contact.phone);
  if (input.contact?.links) contactLines.push(...input.contact.links);

  const header = {
    name: input.fullName || 'Your Name',
    role: input.targetRole || 'Professional',
    contactLines,
  };

  // Process blocks into sections
  const sections: NormalizedPdfModel['sections'] = [];
  const seenBullets = new Set<string>();

  // Define section order and mapping
  const sectionOrder = ['education', 'project', 'experience', 'volunteer', 'skill'];
  const sectionTitles = {
    education: 'EDUCATION',
    project: 'PROJECTS',
    experience: 'EXPERIENCE',
    volunteer: 'VOLUNTEER WORK',
    skill: 'SKILLS',
  };

  // Group blocks by type
  const blocksByType = input.blocks.reduce((acc, block) => {
    if (!acc[block.type]) acc[block.type] = [];
    acc[block.type].push(block);
    return acc;
  }, {} as Record<string, typeof input.blocks>);

  // Process each section type in order
  sectionOrder.forEach(type => {
    const blocks = blocksByType[type] || [];
    if (blocks.length === 0) return;

    const sectionBullets: string[] = [];
    
    blocks.forEach(block => {
      // Use tailored content if available, otherwise use original details
      const bullets = input.tailoredContent?.rewrittenBlocks?.find(
        rb => rb.id === block.id
      )?.bullets || block.details;

      bullets.forEach(bullet => {
        // Clean and normalize bullet
        const cleanBullet = cleanBulletText(bullet);
        if (cleanBullet && !seenBullets.has(cleanBullet)) {
          seenBullets.add(cleanBullet);
          sectionBullets.push(cleanBullet);
        }
      });
    });

    if (sectionBullets.length > 0) {
      // Limit bullets per section (max 6)
      const limitedBullets = sectionBullets.slice(0, 6);
      if (sectionBullets.length > 6) {
        limitedBullets.push('+ more available on request');
      }

      sections.push({
        title: sectionTitles[type as keyof typeof sectionTitles],
        bullets: limitedBullets,
      });
    }
  });

  return { header, sections };
}

function cleanBulletText(text: string): string {
  if (!text) return '';
  
  // Remove emails and phone numbers from bullets (keep in header only)
  let cleaned = text
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email]')
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[phone]')
    .replace(/\b\(\d{3}\)\s*\d{3}[-.]?\d{4}\b/g, '[phone]');

  // Replace fancy symbols with plain bullet
  cleaned = cleaned
    .replace(/[•▪▫‣⁃]/g, '•')
    .replace(/[–—]/g, '-')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'");

  // Hard wrap at ~90-95 characters
  if (cleaned.length > 95) {
    const words = cleaned.split(' ');
    let lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + ' ' + word).length > 90) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = currentLine ? currentLine + ' ' + word : word;
      }
    });
    
    if (currentLine) lines.push(currentLine);
    cleaned = lines.join('\n');
  }

  return cleaned.trim();
}
