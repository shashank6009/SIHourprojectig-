'use client';

import React, { useState } from 'react';
import { healthCheck, getRecommendations, HealthCheckResponse, RecommendationsResponse } from '../api/recommendations';

const RecommendationsDebug: React.FC = () => {
  const [studentId, setStudentId] = useState<string>('student_123');
  const [topN, setTopN] = useState<number>(5);
  const [healthResult, setHealthResult] = useState<HealthCheckResponse | null>(null);
  const [recommendationsResult, setRecommendationsResult] = useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleHealthCheck = async () => {
    setLoading(true);
    setError(null);
    setHealthResult(null);

    try {
      const result = await healthCheck();
      setHealthResult(result);
      console.log('Health check result:', result);
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Health check failed';
      setError(errorMessage);
      console.error('Health check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (!studentId.trim()) {
      setError('Please enter a student ID');
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendationsResult(null);

    try {
      const result = await getRecommendations(studentId.trim(), topN);
      setRecommendationsResult(result);
      console.log('Recommendations result:', result);
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to fetch recommendations';
      setError(errorMessage);
      console.error('Recommendations error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">ML API Debug Tool</h2>
      
      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
            Student ID
          </label>
          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter student ID"
          />
        </div>
        
        <div>
          <label htmlFor="topN" className="block text-sm font-medium text-gray-700 mb-2">
            Top N Recommendations
          </label>
          <input
            id="topN"
            type="number"
            value={topN}
            onChange={(e) => setTopN(parseInt(e.target.value) || 5)}
            min="1"
            max="20"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleHealthCheck}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Pinging...' : 'Ping API'}
        </button>
        
        <button
          onClick={handleGetRecommendations}
          disabled={loading || !studentId.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Fetching...' : 'Fetch Recommendations'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-medium mb-2">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Health Check Results */}
      {healthResult && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Health Check Result:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(healthResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Recommendations Results */}
      {recommendationsResult && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommendations Result:</h3>
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p><strong>Student ID:</strong> {recommendationsResult.student_id}</p>
            <p><strong>Total Recommendations:</strong> {recommendationsResult.total_recommendations}</p>
            <p><strong>Requested Count:</strong> {recommendationsResult.requested_count}</p>
            <p><strong>Returned Count:</strong> {recommendationsResult.recommendations.length}</p>
          </div>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm max-h-96">
            {JSON.stringify(recommendationsResult, null, 2)}
          </pre>
        </div>
      )}

      {/* API Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">API Endpoint:</h3>
        <code className="text-sm text-gray-600">https://5449eed1f56c.ngrok-free.app</code>
      </div>
    </div>
  );
};

export default RecommendationsDebug;
