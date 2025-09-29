import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireConsent } from '@/lib/policy-gate';
import { logProcessing } from '@/lib/processing-log';

// TODO: Phase 2 - Add proper authentication (currently using mock userId)
const mockUserId = '00000000-0000-0000-0000-000000000000';

const AssistantRequestSchema = z.object({
  message: z.string().min(1),
  currentStep: z.string(),
  resumeData: z.any(),
  conversationHistory: z.array(z.object({
    id: z.string(),
    type: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.any(),
  })).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, currentStep, resumeData, conversationHistory = [] } = AssistantRequestSchema.parse(body);

    // Check consent for LLM processing
    const consentCheck = await requireConsent(mockUserId, ['LLM_PROCESSING']);
    if (!consentCheck.ok) {
      return NextResponse.json(
        { 
          error: 'Consent required for AI processing',
          missingConsents: consentCheck.missing 
        },
        { status: 403 }
      );
    }

    // Log processing activity
    await logProcessing({
      userId: mockUserId,
      action: 'AI_ASSISTANT_CHAT',
      lawfulBasis: 'consent',
      consentVersion: consentCheck.version,
      scopesUsed: ['LLM_PROCESSING'],
      metadata: {
        currentStep,
        messageLength: message.length,
        conversationLength: conversationHistory.length,
        region: consentCheck.region,
      },
    });

    // Generate AI response
    const response = await generateAIResponse(message, currentStep, resumeData, conversationHistory);

    return NextResponse.json({
      success: true,
      response,
    });

  } catch (error) {
    console.error('AI Assistant error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to process AI request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function generateAIResponse(
  message: string,
  currentStep: string,
  resumeData: any,
  conversationHistory: any[]
): Promise<string> {
  // Check if we have OpenRouter API key configured
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  
  if (openRouterKey) {
    try {
      return await callOpenRouterAPI(message, currentStep, resumeData, conversationHistory);
    } catch (error) {
      console.error('OpenRouter API error:', error);
      // Fall back to local response
    }
  }

  // Fallback to local AI responses
  return generateLocalResponse(message, currentStep, resumeData);
}

async function callOpenRouterAPI(
  message: string,
  currentStep: string,
  resumeData: any,
  conversationHistory: any[]
): Promise<string> {
  const systemPrompt = `You are a helpful resume writing assistant. You help users create outstanding resumes by providing:

1. Specific, actionable advice
2. Industry best practices
3. Examples and templates
4. ATS optimization tips
5. Content enhancement suggestions

Current step: ${currentStep}
Resume data: ${JSON.stringify(resumeData, null, 2)}

Be concise, helpful, and professional. Provide specific examples when possible.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-5).map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    })),
    { role: 'user', content: message }
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'Resume Builder AI Assistant',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
}

function generateLocalResponse(message: string, currentStep: string, resumeData: any): string {
  const lowerMessage = message.toLowerCase();

  // Context-aware responses based on current step
  if (currentStep === 'personal') {
    if (lowerMessage.includes('email') || lowerMessage.includes('contact')) {
      return `**Professional Email Tips:**

• Use a professional email address (firstname.lastname@email.com)
• Avoid numbers, nicknames, or unprofessional words
• Consider creating a dedicated email for job applications
• Make sure it's easy to read and remember

**Example:** john.smith@email.com ✅
**Avoid:** johnny123@email.com ❌`;
    }
    
    if (lowerMessage.includes('linkedin') || lowerMessage.includes('social')) {
      return `**LinkedIn Profile Tips:**

• Use a professional headshot
• Write a compelling headline
• Include a detailed summary
• List all relevant experience
• Get recommendations from colleagues
• Keep it updated and active

Your LinkedIn URL should be: linkedin.com/in/yourname`;
    }
  }

  if (currentStep === 'summary') {
    if (lowerMessage.includes('summary') || lowerMessage.includes('about')) {
      return `**Professional Summary Structure:**

1. **Your role/position** (e.g., "Experienced Software Engineer")
2. **Years of experience** (e.g., "with 5+ years of experience")
3. **Key skills/expertise** (e.g., "in full-stack development")
4. **What you're seeking** (e.g., "Seeking opportunities in...")

**Example:**
"Experienced Software Engineer with 5+ years of expertise in full-stack development. Passionate about building scalable web applications and leading cross-functional teams. Seeking opportunities in senior development roles."

**Tips:**
• Keep it 2-3 sentences
• Use action words
• Be specific about your skills
• Tailor to your target role`;
    }
  }

  if (currentStep === 'experience') {
    if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
      return `**Experience Section Best Practices:**

**For each role, include:**
• Job title and company name
• Employment dates
• 2-3 key achievements with numbers
• Technologies and tools used

**Action Verbs to Use:**
• Led, Developed, Implemented, Optimized
• Managed, Coordinated, Collaborated
• Designed, Built, Created, Launched

**Example Achievement:**
"Led development of a React application that increased user engagement by 30% and reduced page load time by 50%"

**Tips:**
• Quantify your impact with numbers
• Focus on results, not just duties
• Use present tense for current role, past tense for previous roles`;
    }
  }

  if (currentStep === 'skills') {
    if (lowerMessage.includes('skill') || lowerMessage.includes('technical')) {
      return `**Skills Organization:**

**Technical Skills:**
• Programming languages (JavaScript, Python, Java)
• Frameworks (React, Angular, Django)
• Tools (Git, Docker, AWS)
• Databases (PostgreSQL, MongoDB)

**Soft Skills:**
• Leadership, Communication, Problem-solving
• Teamwork, Time management, Adaptability

**Tips:**
• Be specific: "React.js" not just "JavaScript"
• Include proficiency levels if relevant
• Focus on skills relevant to your target role
• Group related skills together`;
    }
  }

  if (currentStep === 'projects') {
    if (lowerMessage.includes('project') || lowerMessage.includes('portfolio')) {
      return `**Project Showcase Tips:**

**Choose 2-3 projects that:**
• Demonstrate your key skills
• Are relevant to your target role
• Show problem-solving ability
• Have measurable outcomes

**For each project:**
• Clear, descriptive name
• Brief description of what you built
• Technologies and tools used
• Link to live demo or GitHub

**Example:**
"E-commerce Platform - Built a full-stack e-commerce solution using React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard. Increased conversion rate by 25%."

**Tips:**
• Include screenshots or demos if possible
• Highlight your specific contributions
• Show the impact or results achieved`;
    }
  }

  // General responses
  if (lowerMessage.includes('ats') || lowerMessage.includes('optimize')) {
    return `**ATS Optimization Tips:**

• Use standard section headings (Experience, Education, Skills)
• Include relevant keywords from job descriptions
• Use common fonts (Arial, Times New Roman, Calibri)
• Avoid graphics, tables, or complex formatting
• Save as PDF for best compatibility
• Use bullet points for easy scanning
• Include quantifiable achievements

**Keywords to Include:**
• Job-specific technical skills
• Industry terminology
• Action verbs
• Certifications and degrees`;
  }

  if (lowerMessage.includes('example') || lowerMessage.includes('template')) {
    return `**I can provide examples for:**

• Professional summaries
• Experience descriptions
• Project descriptions
• Skills formatting
• Achievement statements

**Just ask me for specific examples like:**
• "Give me an example of a software engineer summary"
• "Show me how to describe a project"
• "Help me write an achievement statement"

I'll provide tailored examples based on your current step and data!`;
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
    return `**I'm here to help with:**

• Writing compelling content
• Formatting and structure
• ATS optimization
• Industry-specific advice
• Examples and templates
• Answering specific questions

**What would you like help with?** I can provide guidance on any part of your resume building process.`;
  }

  // Default response
  return `I understand you're asking about "${message}". 

I'm here to help you create an outstanding resume! I can assist with:

• Writing and improving content
• Formatting and structure
• ATS optimization
• Industry best practices
• Examples and templates

**What specific aspect would you like help with?** Feel free to ask me anything about resume writing, and I'll provide detailed guidance.`;
}
