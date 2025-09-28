/**
 * ATS (Applicant Tracking System) Helpers
 * Detects ATS platforms and provides application checklists
 */

export type ATSPlatform = 'greenhouse' | 'lever' | 'workday' | 'unknown';

export interface ATSInfo {
  ats: ATSPlatform;
  applyUrl: string;
  checklist: string[];
}

/**
 * Detect ATS platform from job URL
 */
export function detectATS(url: string): ATSPlatform {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('greenhouse.io') || urlLower.includes('boards.greenhouse.io')) {
    return 'greenhouse';
  }
  
  if (urlLower.includes('lever.co') || urlLower.includes('jobs.lever.co')) {
    return 'lever';
  }
  
  if (urlLower.includes('workday.com') || urlLower.includes('myworkdayjobs.com')) {
    return 'workday';
  }
  
  return 'unknown';
}

/**
 * Normalize apply URL for better tracking
 */
export function normalizeApplyLink(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Remove tracking parameters
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'source'];
    trackingParams.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    return urlObj.toString();
  } catch (error) {
    return url; // Return original if URL parsing fails
  }
}

/**
 * Get application checklist for specific ATS
 */
export function checklistForATS(kind: ATSPlatform): string[] {
  const baseChecklist = [
    'Review job requirements carefully',
    'Prepare tailored resume and cover letter',
    'Gather relevant portfolio/work samples',
    'Prepare for behavioral questions',
  ];

  switch (kind) {
    case 'greenhouse':
      return [
        ...baseChecklist,
        'Answer knockout questions honestly',
        'Upload resume as PDF',
        'Paste cover letter in text field',
        'Complete all required fields',
        'Confirm location eligibility',
        'Review application before submitting',
      ];
    
    case 'lever':
      return [
        ...baseChecklist,
        'Complete application form thoroughly',
        'Upload resume and cover letter',
        'Answer screening questions',
        'Provide LinkedIn profile if requested',
        'Confirm availability and start date',
        'Double-check contact information',
      ];
    
    case 'workday':
      return [
        ...baseChecklist,
        'Create/update Workday profile',
        'Upload resume and documents',
        'Complete all application sections',
        'Answer assessment questions if any',
        'Confirm work authorization status',
        'Review and submit application',
      ];
    
    default:
      return [
        ...baseChecklist,
        'Follow application instructions carefully',
        'Submit all required documents',
        'Complete all form fields',
        'Review application thoroughly',
      ];
  }
}

/**
 * Get ATS-specific tips
 */
export function getATSTips(kind: ATSPlatform): string[] {
  switch (kind) {
    case 'greenhouse':
      return [
        'Greenhouse uses keyword matching - include relevant skills from the job description',
        'Answer knockout questions carefully - they filter candidates automatically',
        'Upload your resume as a PDF for better parsing',
        'Use standard section headers in your resume (Experience, Education, Skills)',
      ];
    
    case 'lever':
      return [
        'Lever values cultural fit - highlight relevant experiences and values',
        'Complete all optional fields to show thoroughness',
        'Use action verbs and quantify achievements in your resume',
        'Tailor your cover letter to the specific role and company',
      ];
    
    case 'workday':
      return [
        'Workday requires complete profiles - fill out all sections thoroughly',
        'Use consistent formatting in your resume',
        'Include relevant keywords from the job description',
        'Complete any required assessments honestly and thoroughly',
      ];
    
    default:
      return [
        'Focus on relevant keywords from the job description',
        'Use clear, professional formatting',
        'Quantify your achievements with numbers',
        'Tailor your application to the specific role',
      ];
  }
}

/**
 * Analyze job URL and return comprehensive ATS information
 */
export function analyzeJobURL(url: string): ATSInfo {
  const ats = detectATS(url);
  const applyUrl = normalizeApplyLink(url);
  const checklist = checklistForATS(ats);
  
  return {
    ats,
    applyUrl,
    checklist,
  };
}
