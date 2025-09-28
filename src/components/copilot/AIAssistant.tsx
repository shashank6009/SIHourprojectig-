'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Lightbulb, Target, FileText } from 'lucide-react';

interface AIAssistantProps {
  currentStep: string;
  resumeData: any;
  onSuggestion: (suggestion: string, type: 'text' | 'enhancement' | 'example') => void;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant({ currentStep, resumeData, onSuggestion }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with contextual help based on current step
  useEffect(() => {
    const contextualHelp = getContextualHelp(currentStep, resumeData);
    if (contextualHelp && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'assistant',
        content: contextualHelp,
        timestamp: new Date(),
      }]);
    }
  }, [currentStep, resumeData]);

  const getContextualHelp = (step: string, data: any): string => {
    switch (step) {
      case 'personal':
        return `👋 Hi! I'm your AI assistant. I'll help you create an outstanding resume.

**For Personal Information:**
• Use a professional email address
• Include your LinkedIn profile if you have one
• Add your GitHub if you're a developer
• Keep your location format consistent (City, State/Country)

Need help with any of these fields? Just ask me!`;
      
      case 'summary':
        return `📝 **Professional Summary Tips:**

A great summary should:
• Be 2-3 sentences long
• Mention your years of experience
• Highlight your key skills
• State what you're looking for

**Example structure:**
"[Your role] with [X] years of experience in [key skills]. Passionate about [your focus area]. Seeking opportunities in [target role]."

Want me to help you write yours?`;
      
      case 'experience':
        return `💼 **Work Experience Best Practices:**

For each role, include:
• Specific achievements with numbers
• Action verbs (Led, Developed, Implemented)
• Technologies and tools used
• Impact on the business

**Example:**
"Led development of a React application that increased user engagement by 30% and reduced load time by 50%."

I can help you enhance your experience descriptions!`;
      
      case 'education':
        return `🎓 **Education Section:**

Include:
• Institution name
• Degree type and field
• Graduation year
• GPA (if 3.5+)
• Relevant coursework (for recent graduates)

**Pro tip:** If you have multiple degrees, list them in reverse chronological order.

Need help formatting your education?`;
      
      case 'skills':
        return `🛠️ **Skills Organization:**

**Technical Skills:** Programming languages, frameworks, tools
**Soft Skills:** Leadership, communication, problem-solving
**Languages:** If you speak multiple languages

**Tips:**
• Be specific: "React.js" instead of "JavaScript"
• Include proficiency levels if relevant
• Focus on skills relevant to your target role

Want suggestions for your skills?`;
      
      case 'projects':
        return `🚀 **Project Showcase:**

Choose 2-3 projects that:
• Demonstrate your key skills
• Are relevant to your target role
• Show your problem-solving ability

**For each project:**
• Clear project name
• Brief description of what you built
• Technologies used
• Link to demo/code (if available)

I can help you write compelling project descriptions!`;
      
      case 'review':
        return `✨ **Final Review Time!**

Before generating your resume:
• Double-check all information
• Ensure consistency in formatting
• Verify contact information
• Review for any typos

**Ready to generate?** I'll enhance your content with AI and optimize it for ATS systems.

Any last-minute changes needed?`;
      
      default:
        return `👋 Hi! I'm your AI assistant. I'll help you create an outstanding resume. What would you like help with?`;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          currentStep,
          resumeData,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickSuggestions = [
    { icon: Lightbulb, text: 'Help me write a better summary', type: 'enhancement' as const },
    { icon: Target, text: 'Optimize for ATS', type: 'enhancement' as const },
    { icon: FileText, text: 'Give me an example', type: 'example' as const },
    { icon: Sparkles, text: 'Enhance my content', type: 'enhancement' as const },
  ];

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Bot className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">I'll help you create an outstanding resume</p>
      </div>

      {/* Quick Suggestions */}
      <div className="p-3 border-b border-gray-200 bg-blue-50">
        <p className="text-xs font-medium text-blue-800 mb-2">Quick Actions:</p>
        <div className="grid grid-cols-2 gap-2">
          {quickSuggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion.text)}
                className="flex items-center gap-1 text-xs bg-white text-blue-700 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <Icon className="h-3 w-3" />
                <span className="truncate">{suggestion.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.type === 'assistant' && (
                  <Bot className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                )}
                {message.type === 'user' && (
                  <User className="h-4 w-4 mt-0.5 text-blue-200 flex-shrink-0" />
                )}
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
              <div
                className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-blue-600" />
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your resume..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
