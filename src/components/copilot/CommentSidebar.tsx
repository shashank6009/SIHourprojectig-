'use client';

import { useState, useEffect } from 'react';
import { http } from '@/lib/http';
import { ResumeComment } from '@/types/resume';

interface CommentSidebarProps {
  versionId: string;
  isMentorMode?: boolean;
}

export default function CommentSidebar({ versionId, isMentorMode = false }: CommentSidebarProps) {
  const [comments, setComments] = useState<ResumeComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newAuthor, setNewAuthor] = useState(isMentorMode ? 'Mentor' : '');
  const [newBlockId, setNewBlockId] = useState('');
  const [newLineRef, setNewLineRef] = useState<number | undefined>();

  useEffect(() => {
    fetchComments();
  }, [versionId]);

  const fetchComments = async () => {
    try {
      const response = await http.get(`/api/feedback/comment?resumeVersionId=${versionId}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !newAuthor.trim()) return;

    try {
      await http.post('/api/feedback/comment', {
        resumeVersionId: versionId,
        blockId: newBlockId || undefined,
        lineRef: newLineRef,
        author: newAuthor,
        text: newComment,
      });

      setNewComment('');
      setNewBlockId('');
      setNewLineRef(undefined);
      fetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const toggleResolved = async (commentId: string, resolved: boolean) => {
    try {
      await http.patch('/api/feedback/comment', {
        id: commentId,
        resolved,
      });
      fetchComments();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  // Group comments by blockId
  const groupedComments = comments.reduce((acc, comment) => {
    const key = comment.blockId || 'general';
    if (!acc[key]) acc[key] = [];
    acc[key].push(comment);
    return acc;
  }, {} as Record<string, ResumeComment[]>);

  if (loading) {
    return (
      <div className="w-80 bg-gray-50 p-4 border-l">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 p-4 border-l max-h-screen overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Comments & Feedback</h3>
      
      {/* Add new comment form */}
      <div className="mb-6 p-4 bg-white rounded-lg border">
        <h4 className="font-medium mb-3">Add Comment</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Block ID (optional)
            </label>
            <input
              type="text"
              value={newBlockId}
              onChange={(e) => setNewBlockId(e.target.value)}
              placeholder="block-1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Line Reference (optional)
            </label>
            <input
              type="number"
              value={newLineRef || ''}
              onChange={(e) => setNewLineRef(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your feedback..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={addComment}
            disabled={!newComment.trim() || !newAuthor.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Comment
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {Object.entries(groupedComments).map(([blockId, blockComments]) => (
          <div key={blockId} className="bg-white rounded-lg border p-3">
            <h4 className="font-medium text-sm text-gray-600 mb-2">
              {blockId === 'general' ? 'General Comments' : `Block: ${blockId}`}
            </h4>
            
            <div className="space-y-3">
              {blockComments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3 rounded-md border-l-4 ${
                    comment.resolved 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-800">{comment.author}</span>
                      <span className="text-gray-500 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                      {comment.lineRef && (
                        <span className="text-gray-500 ml-2">Line {comment.lineRef}</span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleResolved(comment.id, !comment.resolved)}
                      className={`text-xs px-2 py-1 rounded ${
                        comment.resolved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {comment.resolved ? 'Resolved' : 'Mark Resolved'}
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>No comments yet.</p>
            <p className="text-sm">Add the first comment above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
