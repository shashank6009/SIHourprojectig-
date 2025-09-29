'use client';

import { useState, useEffect } from 'react';
import { http } from '@/lib/http';

interface AnalyticsData {
  weeklyAvgAts: number;
  weeklyAvgAtsChange: number;
  p50Ats: number;
  p90Ats: number;
  exportConversion: number;
  exportConversionChange: number;
  mentorAcceptRate: number;
  mentorAcceptRateChange: number;
  keywordCoverage: number;
  keywordCoverageChange: number;
  topMissingKeywords: Array<{ keyword: string; count: number; frequency: number }>;
  promptVersions: Array<{ version: string; avgAts: number; samples: number; date: string }>;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call an API endpoint
      // For now, we'll use mock data
      const mockData: AnalyticsData = {
        weeklyAvgAts: 78.5,
        weeklyAvgAtsChange: 2.3,
        p50Ats: 76,
        p90Ats: 89,
        exportConversion: 0.65,
        exportConversionChange: 0.05,
        mentorAcceptRate: 0.42,
        mentorAcceptRateChange: -0.02,
        keywordCoverage: 0.73,
        keywordCoverageChange: 0.08,
        topMissingKeywords: [
          { keyword: 'machine learning', count: 45, frequency: 0.23 },
          { keyword: 'python', count: 38, frequency: 0.19 },
          { keyword: 'react', count: 32, frequency: 0.16 },
          { keyword: 'aws', count: 28, frequency: 0.14 },
          { keyword: 'docker', count: 25, frequency: 0.13 },
          { keyword: 'kubernetes', count: 22, frequency: 0.11 },
          { keyword: 'typescript', count: 20, frequency: 0.10 },
          { keyword: 'node.js', count: 18, frequency: 0.09 },
          { keyword: 'sql', count: 16, frequency: 0.08 },
          { keyword: 'git', count: 15, frequency: 0.08 },
        ],
        promptVersions: [
          { version: 'SYSTEM_COACH@2025-09-28', avgAts: 75.2, samples: 156, date: '2025-09-28' },
          { version: 'SYSTEM_COACH@2025-09-25', avgAts: 73.8, samples: 89, date: '2025-09-25' },
          { version: 'SYSTEM_COACH@2025-09-22', avgAts: 72.1, samples: 67, date: '2025-09-22' },
        ],
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockData);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          <p>Error loading analytics: {error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const MetricCard = ({ title, value, change, format = 'number' }: {
    title: string;
    value: number;
    change: number;
    format?: 'number' | 'percentage';
  }) => {
    const formatValue = (val: number) => {
      if (format === 'percentage') {
        return `${(val * 100).toFixed(1)}%`;
      }
      return val.toFixed(1);
    };

    const changeColor = change >= 0 ? 'text-green-600' : 'text-red-600';
    const changeIcon = change >= 0 ? '↗' : '↘';

    return (
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {formatValue(value)}
        </div>
        <div className={`text-sm ${changeColor}`}>
          {changeIcon} {Math.abs(change).toFixed(1)}% vs last week
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Analytics Dashboard</h2>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Weekly Avg ATS Score"
            value={data.weeklyAvgAts}
            change={data.weeklyAvgAtsChange}
          />
          <MetricCard
            title="Export Conversion"
            value={data.exportConversion}
            change={data.exportConversionChange}
            format="percentage"
          />
          <MetricCard
            title="Mentor Accept Rate"
            value={data.mentorAcceptRate}
            change={data.mentorAcceptRateChange}
            format="percentage"
          />
          <MetricCard
            title="Keyword Coverage"
            value={data.keywordCoverage}
            change={data.keywordCoverageChange}
            format="percentage"
          />
        </div>

        {/* ATS Score Distribution */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">ATS Score Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">P50 (Median)</div>
              <div className="text-2xl font-bold text-gray-900">{data.p50Ats}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">P90 (Top 10%)</div>
              <div className="text-2xl font-bold text-gray-900">{data.p90Ats}</div>
            </div>
          </div>
        </div>

        {/* Top Missing Keywords */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Top Missing Keywords (Last 14 Days)</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              {data.topMissingKeywords.slice(0, 10).map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.keyword}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.frequency * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prompt Version Performance */}
        <div>
          <h3 className="text-lg font-medium mb-4">Prompt Version Performance</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              {data.promptVersions.map((version, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-700">{version.version}</div>
                    <div className="text-xs text-gray-500">{version.samples} samples • {version.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{version.avgAts.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">avg ATS</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
