'use client';

import { useState } from 'react';
import { http } from '@/lib/http';
import { InterviewResponse, ResumeBlock } from '@/types/resume';

// TODO: Phase 2 - Add proper form validation with react-hook-form
const INTERVIEW_QUESTIONS = [
  'Tell me about your education or training.',
  'What projects have you worked on?',
  'Any work experience, internships, or volunteering?',
  'What achievements or awards stand out?',
  'List a few top skills you want to highlight.',
];

export default function InterviewFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(INTERVIEW_QUESTIONS.length).fill(''));
  const [result, setResult] = useState<InterviewResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (step: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateResume = async () => {
    setLoading(true);
    try {
      const response = await http.post('/api/interview/structure', {
        answers: answers.filter(answer => answer.trim() !== ''),
      });
      setResult(response.data.content);
    } catch (error) {
      console.error('Interview structure error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBlockPreview = (block: ResumeBlock) => (
    <div key={block.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-1 text-xs rounded-full ${
          block.type === 'experience' ? 'bg-blue-100 text-blue-800' :
          block.type === 'education' ? 'bg-green-100 text-green-800' :
          block.type === 'project' ? 'bg-purple-100 text-purple-800' :
          block.type === 'volunteer' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {block.type}
        </span>
        <h3 className="font-semibold">{block.title}</h3>
      </div>
      {block.description && (
        <p className="text-sm text-gray-600 mb-2">{block.description}</p>
      )}
      <ul className="text-sm space-y-1">
        {block.details.map((detail, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  if (result) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Generated Resume Structure</h2>
          <button
            onClick={() => {
              setResult(null);
              setCurrentStep(0);
              setAnswers(new Array(INTERVIEW_QUESTIONS.length).fill(''));
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Start Over
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium mb-2">AI Rationale:</h3>
          <p className="text-sm text-gray-700">{result.rationale}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-4">Resume Blocks Preview:</h3>
          {result.blocks.map(renderBlockPreview)}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Raw JSON Structure:</h3>
          <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Interview Flow</h2>
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {INTERVIEW_QUESTIONS.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / INTERVIEW_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">
          {INTERVIEW_QUESTIONS[currentStep]}
        </h3>
        
        <textarea
          value={answers[currentStep]}
          onChange={(e) => handleAnswerChange(currentStep, e.target.value)}
          placeholder="Share your thoughts and experiences..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentStep < INTERVIEW_QUESTIONS.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleGenerateResume}
            disabled={loading || answers.every(answer => answer.trim() === '')}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Draft Resume'}
          </button>
        )}
      </div>
    </div>
  );
}
