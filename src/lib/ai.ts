// TODO: Phase 3 - Replace with actual LLM provider calls (OpenAI, Anthropic, etc.)

import { InterviewResponse, ResumeBlock } from '@/types/resume';
import { AI } from '@/config/ai';
import { SYSTEM_COACH, USER_COACH_TEMPLATE } from '@/lib/prompts/resume';
import OpenAI from 'openai';

export interface JDInput {
  url?: string;
  text?: string;
}

export interface JDExtraction {
  skills: string[];
  keywords: string[];
}

export interface ResumeDraftInput {
  profile: Record<string, unknown>;
  targetRole?: string;
  jd?: {
    skills: string[];
    keywords: string[];
  };
}

export interface ResumeDraftOutput {
  content: Record<string, unknown>;
  rationale: string;
}

/**
 * Extract skills and keywords from job description
 * TODO: Phase 3 - Implement actual LLM call
 */
export async function extractFromJD(jd: JDInput): Promise<JDExtraction> {
  // Mock implementation for Phase 1
  const mockSkills = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'PostgreSQL',
    'AWS',
    'Docker',
    'Git',
  ];
  
  const mockKeywords = [
    'frontend development',
    'full-stack',
    'agile methodology',
    'team collaboration',
    'problem solving',
    'code review',
  ];

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    skills: mockSkills.slice(0, Math.floor(Math.random() * 4) + 3),
    keywords: mockKeywords.slice(0, Math.floor(Math.random() * 3) + 2),
  };
}

/**
 * Draft resume content based on profile and job requirements
 * TODO: Phase 3 - Implement actual LLM call
 */
export async function draftResume(input: ResumeDraftInput): Promise<ResumeDraftOutput> {
  // Mock implementation for Phase 1
  const mockContent = {
    personalInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
    },
    summary: `Experienced ${input.targetRole || 'Software Engineer'} with expertise in modern web technologies. Passionate about building scalable applications and collaborating with cross-functional teams.`,
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        duration: '2020 - Present',
        description: 'Led development of customer-facing applications using React and Node.js.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Technology',
        year: '2018',
      },
    ],
    skills: input.jd?.skills || ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
  };

  const mockRationale = `Generated resume tailored for ${input.targetRole || 'software engineering'} role, incorporating relevant skills and keywords from the job description.`;

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    content: mockContent,
    rationale: mockRationale,
  };
}

/**
 * Structure interview responses into resume blocks
 * TODO: Phase 3 - Replace with actual LLM call for better STAR story generation
 */
export async function structureInterview(input: { answers: string[] }): Promise<InterviewResponse> {
  const blocks: ResumeBlock[] = [];
  
  // Process each answer and create structured blocks
  input.answers.forEach((answer, index) => {
    if (!answer || answer.trim() === '') return;
    
    const text = answer.toLowerCase();
    let type: ResumeBlock['type'] = 'skill';
    let title = '';
    let details: string[] = [];
    
    // Deterministic mapping based on content
    if (text.includes('fest') || text.includes('hackathon') || text.includes('project')) {
      type = 'project';
      title = `Project ${index + 1}`;
      details = [
        'Led development of innovative solution using modern technologies',
        'Collaborated with cross-functional team to deliver results on time',
        'Implemented best practices and achieved measurable outcomes',
        'Presented findings to stakeholders and received positive feedback'
      ];
    } else if (text.includes('intern') || text.includes('work') || text.includes('job')) {
      type = 'experience';
      title = `Experience ${index + 1}`;
      details = [
        'Delivered high-quality work products within established timelines',
        'Collaborated effectively with team members and stakeholders',
        'Identified and resolved complex challenges using analytical thinking',
        'Contributed to process improvements and operational efficiency'
      ];
    } else if (text.includes('education') || text.includes('degree') || text.includes('course')) {
      type = 'education';
      title = `Education ${index + 1}`;
      details = [
        'Completed comprehensive coursework in relevant field',
        'Maintained strong academic performance and GPA',
        'Participated in relevant extracurricular activities and projects',
        'Developed foundational knowledge and practical skills'
      ];
    } else if (text.includes('volunteer') || text.includes('community')) {
      type = 'volunteer';
      title = `Volunteer Work ${index + 1}`;
      details = [
        'Dedicated time and effort to support community initiatives',
        'Worked collaboratively with diverse groups and organizations',
        'Demonstrated leadership and initiative in volunteer activities',
        'Made meaningful impact on community and social causes'
      ];
    } else {
      type = 'skill';
      title = `Skill Set ${index + 1}`;
      details = [
        'Proficient in relevant technical and soft skills',
        'Applied skills effectively in various professional contexts',
        'Continuously learning and adapting to new technologies',
        'Strong foundation for continued professional development'
      ];
    }
    
    blocks.push({
      id: `block-${index + 1}`,
      type,
      title,
      description: answer.substring(0, 100) + (answer.length > 100 ? '...' : ''),
      startDate: type === 'experience' || type === 'education' ? '2020-01-01' : undefined,
      endDate: type === 'experience' || type === 'education' ? '2023-12-31' : undefined,
      details,
    });
  });
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    blocks,
    rationale: `Structured ${blocks.length} interview responses into resume blocks with STAR-style details. TODO: Replace with LLM-generated content in Phase 3.`,
  };
}

/**
 * Coach and tailor resume blocks to job description
 * TODO: Phase 3 - Add support for Anthropic and Bedrock providers
 */
export async function coachAndTailor(input: {
  blocks: ResumeBlock[];
  jd: { text: string; keywords: string[] };
}): Promise<{
  rewrittenBlocks: { id: string; bullets: string[]; matchedKeywords: string[]; missingKeywords: string[] }[];
  atsScore: number;
  gapSuggestions: string[];
}> {
  try {
    if (AI.provider === 'openai') {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: AI.model,
        messages: [
          { role: 'system', content: SYSTEM_COACH },
          { 
            role: 'user', 
            content: USER_COACH_TEMPLATE({
              blocks: input.blocks,
              jdText: input.jd.text,
              jdKeywords: input.jd.keywords,
              maxBullets: 20,
            })
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      const parsed = JSON.parse(content);
      
      // Basic validation
      if (!parsed.rewrittenBlocks || !Array.isArray(parsed.rewrittenBlocks)) {
        throw new Error('Invalid response format');
      }

      return {
        rewrittenBlocks: parsed.rewrittenBlocks,
        atsScore: parsed.atsScore || 75,
        gapSuggestions: parsed.gapSuggestions || [],
      };
    }
    
    // Fallback for other providers (not implemented yet)
    throw new Error(`Provider ${AI.provider} not implemented yet`);
    
  } catch (error) {
    console.error('LLM coaching error:', error);
    
    // Fallback to deterministic heuristics
    return fallbackCoaching(input);
  }
}

/**
 * Fallback coaching with deterministic heuristics
 */
function fallbackCoaching(input: {
  blocks: ResumeBlock[];
  jd: { text: string; keywords: string[] };
}): {
  rewrittenBlocks: { id: string; bullets: string[]; matchedKeywords: string[]; missingKeywords: string[] }[];
  atsScore: number;
  gapSuggestions: string[];
} {
  const rewrittenBlocks = input.blocks.map((block) => {
    const matchedKeywords = input.jd.keywords.filter(keyword => 
      block.details.some((detail: string) => 
        detail.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    const missingKeywords = input.jd.keywords.filter(keyword => 
      !matchedKeywords.includes(keyword)
    );

    // Simple heuristic: prefix with action verbs and limit length
    const actionVerbs = ['Developed', 'Implemented', 'Led', 'Managed', 'Created', 'Improved', 'Optimized'];
    const bullets = block.details.map((detail: string, i: number) => {
      const verb = actionVerbs[i % actionVerbs.length];
      const truncated = detail.length > 80 ? detail.substring(0, 77) + '...' : detail;
      return `${verb} ${truncated}`;
    });

    return {
      id: block.id,
      bullets,
      matchedKeywords,
      missingKeywords: missingKeywords.slice(0, 3), // Limit to top 3
    };
  });

  // Simple ATS score calculation
  const totalKeywords = input.jd.keywords.length;
  const matchedCount = rewrittenBlocks.reduce((sum, block) => sum + block.matchedKeywords.length, 0);
  const atsScore = Math.min(95, Math.max(60, Math.round((matchedCount / totalKeywords) * 100)));

  const gapSuggestions = [
    'Add quantified results where possible (numbers, percentages, time saved)',
    'Include relevant technical skills mentioned in the job description',
    'Highlight leadership and collaboration experiences',
  ];

  return {
    rewrittenBlocks,
    atsScore,
    gapSuggestions,
  };
}
