import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { normalizeForPdf, NormalizedPdfModel } from './normalize';
import { InterviewResponse, PdfOptions } from '@/types/resume';
import { TemplateClassic } from './templates/classic';
import { TemplateCompact } from './templates/compact';
import { TemplateModern } from './templates/modern';

export async function renderPdfBuffer(args: {
  content: InterviewResponse;
  options: PdfOptions;
  meta?: {
    fullName?: string;
    contact?: {
      email?: string;
      phone?: string;
      links?: string[];
    };
    targetRole?: string;
  };
}): Promise<Uint8Array> {
  // Normalize the content for PDF generation
  const normalizedModel = normalizeForPdf({
    ...args.content,
    fullName: args.meta?.fullName,
    contact: args.meta?.contact,
    targetRole: args.meta?.targetRole,
  });

  // Select template component
  let TemplateComponent;
  switch (args.options.template) {
    case 'compact':
      TemplateComponent = TemplateCompact;
      break;
    case 'modern':
      TemplateComponent = TemplateModern;
      break;
    case 'classic':
    default:
      TemplateComponent = TemplateClassic;
      break;
  }

  // Render PDF
  const pdfDoc = pdf(
    React.createElement(TemplateComponent, { model: normalizedModel, options: args.options })
  );

  // Convert to buffer
  const buffer = await pdfDoc.toBuffer();
  return buffer;
}
