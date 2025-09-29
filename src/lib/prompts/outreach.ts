/**
 * Outreach Prompts Module
 * Contains prompts for generating cover letters and outreach messages
 */

export const SYSTEM_COVER = `You are a concise, evidence-driven cover letter generator. 1 page max. Align to JD; quantify impact; human tone; ATS-friendly (no tables/graphics). Output plain text paragraphs.`;

export function USER_COVER(args: {
  studentBlocks: any[];
  jdText: string;
  company?: string;
  role?: string;
}): string {
  return `
CANDIDATE_STRENGTHS_JSON:
${JSON.stringify(args.studentBlocks)}

JOB_DESCRIPTION:
${args.jdText}

COMPANY:${args.company || ""}
ROLE:${args.role || ""}

Write a 3–4 paragraph cover letter. Paragraph 1: hook with relevant value. Paragraph 2–3: map 2–3 achievements to JD needs with numbers. Paragraph 4: close with availability & shortlist CTA.`;
}

export function EMAIL_TEMPLATE(args: {
  company?: string;
  role?: string;
}): string {
  return `Subject: ${args.role ? args.role + " — " : ""}Application | Impact-focused candidate

Hi ${args.company ? "Recruiting Team at " + args.company : "Recruiting Team"},
I tailored my resume specifically for the ${args.role || "role"}. Highlights: [3 bullets aligned to JD]. Would appreciate a 15-min conversation this week to discuss fit.
Best,
<Name> | <Email> | <Phone> | <LinkedIn>`;
}

export function INMAIL_TEMPLATE(args: {
  company?: string;
  role?: string;
}): string {
  return `Hi ${args.company ? args.company + " team" : "there"}, I aligned my resume to ${args.role || "the role"} and quantified outcomes (e.g., …%). Open to a quick chat? <short link to portfolio/resume>`;
}

/**
 * Generate a personalized cover letter using AI
 */
export async function generateCoverLetter(
  studentBlocks: any[],
  jdText: string,
  company?: string,
  role?: string
): Promise<string> {
  // This would typically call an AI service
  // For now, return a template-based approach
  const template = `
Dear ${company ? `${company} Hiring Team` : "Hiring Manager"},

I am writing to express my strong interest in the ${role || "position"} at ${company || "your organization"}. Based on the job description, I believe my background aligns well with your requirements.

${studentBlocks.slice(0, 2).map((block, index) => {
  const achievement = block.details?.[0] || block.description || "Relevant experience";
  return `In my experience, I have ${achievement.toLowerCase()}. This demonstrates my ability to deliver results in areas relevant to your needs.`;
}).join('\n\n')}

I am excited about the opportunity to contribute to ${company || "your team"} and would welcome the chance to discuss how my skills and experience can add value to your organization.

Thank you for your consideration. I look forward to hearing from you.

Best regards,
[Your Name]
`;

  return template.trim();
}

/**
 * Generate personalized email template
 */
export function generateEmailTemplate(
  company?: string,
  role?: string,
  highlights?: string[]
): string {
  const defaultHighlights = [
    "Delivered measurable results in previous roles",
    "Strong technical and analytical skills",
    "Proven track record of collaboration and leadership"
  ];

  const bulletPoints = (highlights || defaultHighlights)
    .slice(0, 3)
    .map(highlight => `• ${highlight}`)
    .join('\n');

  return `Subject: ${role ? `${role} — ` : ""}Application | Impact-focused candidate

Hi ${company ? `Recruiting Team at ${company}` : "Recruiting Team"},

I tailored my resume specifically for the ${role || "role"}. Highlights:
${bulletPoints}

Would appreciate a 15-min conversation this week to discuss fit.

Best,
<Name> | <Email> | <Phone> | <LinkedIn>`;
}

/**
 * Generate personalized LinkedIn InMail template
 */
export function generateInMailTemplate(
  company?: string,
  role?: string,
  quantifiedOutcome?: string
): string {
  const outcome = quantifiedOutcome || "improved efficiency by 25%";
  
  return `Hi ${company ? `${company} team` : "there"}, 

I aligned my resume to ${role || "the role"} and quantified outcomes (e.g., ${outcome}). Open to a quick chat? 

<short link to portfolio/resume>`;
}
