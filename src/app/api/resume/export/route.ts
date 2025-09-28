import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireConsent } from '@/lib/policy-gate';
import { logProcessing } from '@/lib/processing-log';

// TODO: Phase 2 - Add proper authentication (currently using mock userId)
const mockUserId = '00000000-0000-0000-0000-000000000000';

const ExportRequestSchema = z.object({
  resumeData: z.any(), // The generated resume data
  template: z.enum(['classic', 'modern', 'compact']).default('modern'),
  format: z.enum(['pdf', 'docx', 'html']).default('pdf'),
  includeContact: z.boolean().default(true),
  fontSize: z.number().min(8).max(16).default(11),
  lineHeight: z.number().min(1).max(2).default(1.25),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeData, template, format, includeContact, fontSize, lineHeight } = ExportRequestSchema.parse(body);

    // Check consent for data export
    const consentCheck = await requireConsent(mockUserId, ['DATA_EXPORT']);
    if (!consentCheck.ok) {
      return NextResponse.json(
        { 
          error: 'Consent required for data export',
          missingConsents: consentCheck.missing 
        },
        { status: 403 }
      );
    }

    // Log processing activity
    await logProcessing({
      userId: mockUserId,
      action: 'RESUME_EXPORT',
      lawfulBasis: 'consent',
      consentVersion: consentCheck.version,
      scopesUsed: ['DATA_EXPORT'],
      metadata: {
        format,
        template,
        includeContact,
        fontSize,
        lineHeight,
        region: consentCheck.region,
      },
    });

    // Generate the resume in the requested format
    const exportResult = await generateResumeExport(resumeData, {
      template,
      format,
      includeContact,
      fontSize,
      lineHeight,
    });

    return NextResponse.json({
      success: true,
      data: {
        downloadUrl: exportResult.downloadUrl,
        filename: exportResult.filename,
        format,
        template,
        size: exportResult.size,
      },
    });

  } catch (error) {
    console.error('Resume export error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to export resume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function generateResumeExport(resumeData: any, options: {
  template: string;
  format: string;
  includeContact: boolean;
  fontSize: number;
  lineHeight: number;
}) {
  const { template, format, includeContact, fontSize, lineHeight } = options;
  
  // For now, we'll generate a simple HTML version and provide a download URL
  // In a real implementation, you would use libraries like puppeteer for PDF generation
  // or docx for Word document generation
  
  const htmlContent = generateHTMLResume(resumeData, {
    template,
    includeContact,
    fontSize,
    lineHeight,
  });

  // Create a data URL for download
  let downloadUrl: string;
  let filename: string;
  let size: number;

  if (format === 'html') {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    downloadUrl = URL.createObjectURL(blob);
    filename = `${resumeData.personalInfo?.fullName || 'resume'}-resume.html`;
    size = blob.size;
  } else if (format === 'pdf') {
    // For PDF, we'll create a simple HTML that can be printed to PDF
    const pdfHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Resume - ${resumeData.personalInfo?.fullName || 'Resume'}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: ${fontSize}px; line-height: ${lineHeight}; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .contact { color: #666; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #333; margin-bottom: 15px; }
            .experience-item, .education-item, .project-item { margin-bottom: 15px; }
            .company, .institution, .project-name { font-weight: bold; }
            .position, .degree { font-style: italic; }
            .duration, .year { color: #666; }
            .skills { display: flex; flex-wrap: wrap; gap: 5px; }
            .skill { background: #f0f0f0; padding: 3px 8px; border-radius: 3px; font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
    
    const blob = new Blob([pdfHTML], { type: 'text/html' });
    downloadUrl = URL.createObjectURL(blob);
    filename = `${resumeData.personalInfo?.fullName || 'resume'}-resume.html`;
    size = blob.size;
  } else {
    // For other formats, return HTML as fallback
    const blob = new Blob([htmlContent], { type: 'text/html' });
    downloadUrl = URL.createObjectURL(blob);
    filename = `${resumeData.personalInfo?.fullName || 'resume'}-resume.html`;
    size = blob.size;
  }

  return {
    downloadUrl,
    filename,
    size,
  };
}

function generateHTMLResume(resumeData: any, options: {
  template: string;
  includeContact: boolean;
  fontSize: number;
  lineHeight: number;
}) {
  const { includeContact } = options;
  
  let html = '<div class="resume">';
  
  // Header
  html += '<div class="header">';
  html += `<div class="name">${resumeData.personalInfo?.fullName || 'Your Name'}</div>`;
  
  if (includeContact) {
    html += '<div class="contact">';
    if (resumeData.personalInfo?.email) {
      html += `${resumeData.personalInfo.email} • `;
    }
    if (resumeData.personalInfo?.phone) {
      html += `${resumeData.personalInfo.phone} • `;
    }
    if (resumeData.personalInfo?.location) {
      html += resumeData.personalInfo.location;
    }
    html += '</div>';
  }
  html += '</div>';
  
  // Summary
  if (resumeData.summary) {
    html += '<div class="section">';
    html += '<div class="section-title">Professional Summary</div>';
    html += `<p>${resumeData.summary}</p>`;
    html += '</div>';
  }
  
  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    html += '<div class="section">';
    html += '<div class="section-title">Experience</div>';
    resumeData.experience.forEach((exp: any) => {
      html += '<div class="experience-item">';
      html += `<div class="company">${exp.company}</div>`;
      html += `<div class="position">${exp.position}</div>`;
      html += `<div class="duration">${exp.duration}</div>`;
      if (exp.description) {
        html += `<p>${exp.description}</p>`;
      }
      if (exp.achievements && exp.achievements.length > 0) {
        html += '<ul>';
        exp.achievements.forEach((achievement: string) => {
          html += `<li>${achievement}</li>`;
        });
        html += '</ul>';
      }
      html += '</div>';
    });
    html += '</div>';
  }
  
  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    html += '<div class="section">';
    html += '<div class="section-title">Education</div>';
    resumeData.education.forEach((edu: any) => {
      html += '<div class="education-item">';
      html += `<div class="institution">${edu.institution}</div>`;
      html += `<div class="degree">${edu.degree}</div>`;
      html += `<div class="year">${edu.year}</div>`;
      if (edu.gpa) {
        html += `<div>GPA: ${edu.gpa}</div>`;
      }
      html += '</div>';
    });
    html += '</div>';
  }
  
  // Skills
  if (resumeData.skills) {
    html += '<div class="section">';
    html += '<div class="section-title">Skills</div>';
    
    if (resumeData.skills.technical && resumeData.skills.technical.length > 0) {
      html += '<div><strong>Technical Skills:</strong></div>';
      html += '<div class="skills">';
      resumeData.skills.technical.forEach((skill: string) => {
        html += `<span class="skill">${skill}</span>`;
      });
      html += '</div>';
    }
    
    if (resumeData.skills.soft && resumeData.skills.soft.length > 0) {
      html += '<div style="margin-top: 10px;"><strong>Soft Skills:</strong></div>';
      html += '<div class="skills">';
      resumeData.skills.soft.forEach((skill: string) => {
        html += `<span class="skill">${skill}</span>`;
      });
      html += '</div>';
    }
    
    if (resumeData.skills.languages && resumeData.skills.languages.length > 0) {
      html += '<div style="margin-top: 10px;"><strong>Languages:</strong></div>';
      html += '<div class="skills">';
      resumeData.skills.languages.forEach((language: string) => {
        html += `<span class="skill">${language}</span>`;
      });
      html += '</div>';
    }
    
    html += '</div>';
  }
  
  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    html += '<div class="section">';
    html += '<div class="section-title">Projects</div>';
    resumeData.projects.forEach((project: any) => {
      html += '<div class="project-item">';
      html += `<div class="project-name">${project.name}</div>`;
      if (project.description) {
        html += `<p>${project.description}</p>`;
      }
      if (project.technologies && project.technologies.length > 0) {
        html += '<div class="skills">';
        project.technologies.forEach((tech: string) => {
          html += `<span class="skill">${tech}</span>`;
        });
        html += '</div>';
      }
      if (project.link) {
        html += `<div><a href="${project.link}" target="_blank">View Project</a></div>`;
      }
      html += '</div>';
    });
    html += '</div>';
  }
  
  html += '</div>';
  
  return html;
}