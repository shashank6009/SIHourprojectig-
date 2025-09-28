'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { http } from '@/lib/http';
import CommentSidebar from '@/components/copilot/CommentSidebar';

function MentorReviewContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState<any>(null);
  const [versionId, setVersionId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('No review token provided');
      setLoading(false);
      return;
    }

    verifyToken(token);
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    try {
      const response = await http.get(`/api/feedback/share?token=${token}`);
      setVersion(response.data.version);
      setVersionId(response.data.version.id);
    } catch (error: any) {
      console.error('Token verification failed:', error);
      setError(error.message || 'Invalid or expired review link');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying review link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Link Expired</h1>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-500">
            Please request a new review link from the resume owner.
          </p>
        </div>
      </div>
    );
  }

  if (!version) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Mentor Review Mode</h1>
              <p className="text-sm text-gray-600">
                Reviewing: {version.label} • Created: {new Date(version.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Read-only access
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex">
          {/* Resume Content */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6 mr-6">
            <h2 className="text-lg font-semibold mb-4">Resume Content</h2>
            
            <div className="space-y-6">
              {version.content?.blocks?.map((block: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 capitalize">
                    {block.type} - {block.title}
                  </h3>
                  
                  {block.description && (
                    <p className="text-sm text-gray-600 mb-3 italic">
                      {block.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    {block.details?.map((detail: string, detailIndex: number) => (
                      <div key={detailIndex} className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-sm text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                  
                  {(block.startDate || block.endDate) && (
                    <div className="mt-3 text-xs text-gray-500">
                      {block.startDate && <span>From: {block.startDate}</span>}
                      {block.startDate && block.endDate && <span> • </span>}
                      {block.endDate && <span>To: {block.endDate}</span>}
                    </div>
                  )}
                </div>
              ))}
              
              {version.content?.tailoredContent && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Tailored Content</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>ATS Score:</strong> {version.content.tailoredContent.atsScore}%
                    </p>
                    {version.content.tailoredContent.gapSuggestions?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-blue-800 mb-2">Gap Suggestions:</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {version.content.tailoredContent.gapSuggestions.map((suggestion: string, index: number) => (
                            <li key={index}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Sidebar */}
          {versionId && (
            <CommentSidebar versionId={versionId} isMentorMode={true} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function MentorReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review page...</p>
        </div>
      </div>
    }>
      <MentorReviewContent />
    </Suspense>
  );
}
