import { z } from 'zod';

// TODO: Phase 2 - Add more comprehensive validation and business rules
export const ResumeCoreSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1),
  targetRole: z.string().optional(),
  atsScore: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ResumeBlockSchema = z.object({
  id: z.string(),
  type: z.enum(['education', 'experience', 'project', 'volunteer', 'skill']),
  title: z.string(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  details: z.array(z.string()),
});

export const TailoredContentSchema = z.object({
  rewrittenBlocks: z.array(z.object({
    id: z.string(),
    bullets: z.array(z.string()),
    matchedKeywords: z.array(z.string()),
    missingKeywords: z.array(z.string()),
  })),
  atsScore: z.number(),
  gapSuggestions: z.array(z.string()),
  jdKeywords: z.array(z.string()),
  jdText: z.string(),
});

export const InterviewResponseSchema = z.object({
  blocks: z.array(ResumeBlockSchema),
  rationale: z.string().optional(),
  tailoredContent: TailoredContentSchema.optional(),
});

export const ResumeVersionSchema = z.object({
  id: z.string().uuid(),
  resumeId: z.string().uuid(),
  jobTargetId: z.string().uuid().nullable().optional(),
  label: z.string().min(1),
  content: InterviewResponseSchema, // Updated to use structured content
  atsScore: z.number().nullable().optional(),
  createdAt: z.string(),
});

export const JobTargetSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  url: z.string().url().nullable().optional(),
  jdText: z.string().nullable().optional(),
  extractedSkills: z.array(z.string()).nullable().optional(),
  keywords: z.array(z.string()).nullable().optional(),
  createdAt: z.string(),
});

export const PdfTemplateSchema = z.enum(['classic', 'compact', 'modern']);

export const PdfOptionsSchema = z.object({
  template: PdfTemplateSchema,
  includeContact: z.boolean().optional(),
  lineHeight: z.number().optional(),
  fontSize: z.number().optional(),
});

export const ResumeCommentSchema = z.object({
  id: z.string().uuid(),
  resumeVersionId: z.string().uuid(),
  blockId: z.string().optional(),
  lineRef: z.number().optional(),
  author: z.string().min(1),
  text: z.string().min(1),
  resolved: z.boolean(),
  createdAt: z.string(),
});

// Phase 7 - Batch processing schemas
export const BatchSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1),
  total: z.number().int().min(0),
  processed: z.number().int().min(0),
  failed: z.number().int().min(0),
  status: z.enum(['created', 'running', 'completed', 'failed', 'canceled']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const BatchItemSchema = z.object({
  id: z.string().uuid(),
  batchId: z.string().uuid(),
  company: z.string().optional(),
  role: z.string().optional(),
  jdUrl: z.string().url().optional(),
  jdText: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  resumeVersionId: z.string().uuid().optional(),
  atsScore: z.number().optional(),
  status: z.enum(['queued', 'processing', 'done', 'failed']),
  error: z.string().nullable().optional(),
  assets: z.record(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// TypeScript types inferred from Zod schemas
export type ResumeCore = z.infer<typeof ResumeCoreSchema>;
export type ResumeBlock = z.infer<typeof ResumeBlockSchema>;
export type TailoredContent = z.infer<typeof TailoredContentSchema>;
export type InterviewResponse = z.infer<typeof InterviewResponseSchema>;
export type ResumeVersion = z.infer<typeof ResumeVersionSchema>;
export type JobTarget = z.infer<typeof JobTargetSchema>;
export type PdfTemplate = z.infer<typeof PdfTemplateSchema>;
export type PdfOptions = z.infer<typeof PdfOptionsSchema>;
export type ResumeComment = z.infer<typeof ResumeCommentSchema>;
export type Batch = z.infer<typeof BatchSchema>;
export type BatchItem = z.infer<typeof BatchItemSchema>;
