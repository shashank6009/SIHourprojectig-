'use client';

import { useState, useEffect } from 'react';
import { flags } from '@/config/flags';
import { http } from '@/lib/http';
import InterviewFlow from '@/components/copilot/InterviewFlow';
import CommentSidebar from '@/components/copilot/CommentSidebar';
import VersionDiff from '@/components/copilot/VersionDiff';
import AnalyticsDashboard from '@/components/copilot/AnalyticsDashboard';
import ResumeBuilderFlow from '@/components/copilot/ResumeBuilderFlow';

// TODO: Phase 2 - Add proper form validation with react-hook-form
export default function CopilotPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'resume-builder' | 'interview' | 'jd' | 'align' | 'export' | 'feedback' | 'diff' | 'analytics' | 'placement'>('resume-builder');
  const [jdText, setJdText] = useState('');
  const [jdUrl, setJdUrl] = useState('');
  const [profileText, setProfileText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jdResult, setJdResult] = useState<any>(null);
  const [resumeResult, setResumeResult] = useState<any>(null);
  const [loading, setLoading] = useState({ jd: false, resume: false, tailor: false, export: false });
  
  // Alignment tab state
  const [alignJdText, setAlignJdText] = useState('');
  const [alignJdUrl, setAlignJdUrl] = useState('');
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [tailorResult, setTailorResult] = useState<any>(null);
  const [availableVersions, setAvailableVersions] = useState<any[]>([]);
  
  // Export tab state
  const [exportVersionId, setExportVersionId] = useState('');
  const [exportTemplate, setExportTemplate] = useState<'classic' | 'compact' | 'modern'>('classic');
  const [exportFontSize, setExportFontSize] = useState(11);
  const [exportLineHeight, setExportLineHeight] = useState(1.25);
  const [exportIncludeContact, setExportIncludeContact] = useState(true);
  const [exportFullName, setExportFullName] = useState('');
  const [exportEmail, setExportEmail] = useState('');
  const [exportPhone, setExportPhone] = useState('');
  const [exportLinks, setExportLinks] = useState('');
  const [exportTargetRole, setExportTargetRole] = useState('');
  const [exportResult, setExportResult] = useState<any>(null);
  
  // Feedback tab state
  const [feedbackVersionId, setFeedbackVersionId] = useState('');
  const [shareResult, setShareResult] = useState<any>(null);
  
  // Version diff state
  const [diffVersionA, setDiffVersionA] = useState<any>(null);
  const [diffVersionB, setDiffVersionB] = useState<any>(null);

  // Placement Mode state
  const [batchLabel, setBatchLabel] = useState('');
  const [batchId, setBatchId] = useState('');
  const [jdUrls, setJdUrls] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [batchItems, setBatchItems] = useState<any[]>([]);
  const [batchStatus, setBatchStatus] = useState<any>(null);
  const [batchLoading, setBatchLoading] = useState({ create: false, ingest: false, run: false, export: false });
  const [webhookEnabled, setWebhookEnabled] = useState(false);

  // Placement Mode handlers
  const handleCreateBatch = async () => {
    if (!batchLabel) return;
    
    setBatchLoading(prev => ({ ...prev, create: true }));
    try {
      const result = await http.post('/api/batch/create', { label: batchLabel }) as any;
      setBatchId(result.data.batchId);
    } catch (error) {
      console.error('Create batch error:', error);
    } finally {
      setBatchLoading(prev => ({ ...prev, create: false }));
    }
  };

  const handleIngestJDs = async () => {
    if (!batchId) return;
    
    setBatchLoading(prev => ({ ...prev, ingest: true }));
    try {
      let items: any[] = [];
      
      if (csvFile) {
        // Parse CSV file
        const Papa = (await import('papaparse')).default;
        const text = await csvFile.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        items = parsed.data.map((row: any) => ({
          company: row.company,
          role: row.role,
          url: row.url,
          text: row.jd_text,
        }));
      } else if (jdUrls) {
        // Parse URLs from textarea
        const urls = jdUrls.split('\n').filter(url => url.trim());
        items = urls.map(url => ({ url: url.trim() }));
      }
      
      const result = await http.post('/api/batch/ingest', { batchId, items }) as any;
      setBatchItems(items);
      
      // Start polling for status updates
      if (result.data.success) {
        startStatusPolling();
      }
    } catch (error) {
      console.error('Ingest JDs error:', error);
    } finally {
      setBatchLoading(prev => ({ ...prev, ingest: false }));
    }
  };

  const handleRunBatch = async () => {
    if (!batchId) return;
    
    setBatchLoading(prev => ({ ...prev, run: true }));
    try {
      await http.post('/api/batch/run', { batchId, concurrency: 2 });
      startStatusPolling();
    } catch (error) {
      console.error('Run batch error:', error);
    } finally {
      setBatchLoading(prev => ({ ...prev, run: false }));
    }
  };

  const handleExportBatch = async () => {
    if (!batchId) return;
    
    setBatchLoading(prev => ({ ...prev, export: true }));
    try {
      const response = await fetch(`/api/batch/export?batchId=${batchId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `batch_${batchLabel.replace(/[^a-zA-Z0-9-]/g, '_')}_${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export batch error:', error);
    } finally {
      setBatchLoading(prev => ({ ...prev, export: false }));
    }
  };

  const startStatusPolling = () => {
    const pollInterval = setInterval(async () => {
      if (!batchId) {
        clearInterval(pollInterval);
        return;
      }
      
      try {
        const response = await fetch(`/api/batch/status?batchId=${batchId}`);
        if (response.ok) {
          const status = await response.json();
          setBatchStatus(status);
          
          // Stop polling if batch is completed or failed
          if (status.summary?.status === 'completed' || status.summary?.status === 'failed') {
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 3000); // Poll every 3 seconds
    
    // Clean up after 10 minutes
    setTimeout(() => clearInterval(pollInterval), 10 * 60 * 1000);
  };

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!flags.RESUME_COPILOT_ENABLED) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Feature Not Available</h1>
          <p className="text-gray-600">Resume Co-Pilot is currently disabled.</p>
        </div>
      </div>
    );
  }

  const handleJDParse = async () => {
    if (!jdText && !jdUrl) return;
    
    setLoading(prev => ({ ...prev, jd: true }));
    try {
      const result = await http.post('/api/jd/parse', {
        jdText: jdText || undefined,
        url: jdUrl || undefined,
      }) as any;
      setJdResult(result.data);
    } catch (error) {
      console.error('JD parse error:', error);
    } finally {
      setLoading(prev => ({ ...prev, jd: false }));
    }
  };

  const handleResumeDraft = async () => {
    if (!profileText) return;
    
    setLoading(prev => ({ ...prev, resume: true }));
    try {
      const result = await http.post('/api/resume/draft', {
        profile: { text: profileText },
        targetRole: targetRole || undefined,
        jd: jdResult || undefined,
      }) as any;
      setResumeResult(result.data);
    } catch (error) {
      console.error('Resume draft error:', error);
    } finally {
      setLoading(prev => ({ ...prev, resume: false }));
    }
  };

  const handleExportPDF = async () => {
    if (!resumeResult?.version?.id) return;
    
    try {
      const result = await http.post('/api/resume/export', {
        resumeVersionId: resumeResult.version.id,
      }) as any;
      alert(result.message);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleTailorResume = async () => {
    if (!selectedVersionId || (!alignJdText && !alignJdUrl)) return;
    
    setLoading(prev => ({ ...prev, tailor: true }));
    try {
      const result = await http.post('/api/coach/tailor', {
        resumeVersionId: selectedVersionId,
        jd: {
          text: alignJdText || undefined,
          url: alignJdUrl || undefined,
        },
      }) as any;
      setTailorResult(result.data);
    } catch (error) {
      console.error('Tailor error:', error);
    } finally {
      setLoading(prev => ({ ...prev, tailor: false }));
    }
  };

  const handleExportPdf = async () => {
    if (!exportVersionId) return;
    
    setLoading(prev => ({ ...prev, export: true }));
    try {
      const links = exportLinks ? exportLinks.split(',').map(link => link.trim()).filter(Boolean) : [];
      
      const result = await http.post('/api/resume/export', {
        resumeVersionId: exportVersionId,
        options: {
          template: exportTemplate,
          includeContact: exportIncludeContact,
          lineHeight: exportLineHeight,
          fontSize: exportFontSize,
        },
        meta: {
          fullName: exportFullName || undefined,
          contact: {
            email: exportEmail || undefined,
            phone: exportPhone || undefined,
            links: links.length > 0 ? links : undefined,
          },
          targetRole: exportTargetRole || undefined,
        },
      }) as any;
      setExportResult(result.data);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setLoading(prev => ({ ...prev, export: false }));
    }
  };

  const handleShareForReview = async () => {
    if (!feedbackVersionId) return;
    
    try {
      const result = await http.post('/api/feedback/share', {
        resumeVersionId: feedbackVersionId,
      }) as any;
      setShareResult(result.data);
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Resume Builder</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('resume-builder')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'resume-builder'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Build Resume
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'export'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tab Content */}
        {activeTab === 'resume-builder' ? (
          <ResumeBuilderFlow />
        ) : activeTab === 'interview' ? (
          <InterviewFlow />
        ) : activeTab === 'align' ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Align Resume to Job Description</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description Text
                </label>
                <textarea
                  value={alignJdText}
                  onChange={(e) => setAlignJdText(e.target.value)}
                  placeholder="Paste job description here..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job URL (Optional)
                </label>
                <input
                  type="url"
                  value={alignJdUrl}
                  onChange={(e) => setAlignJdUrl(e.target.value)}
                  placeholder="https://example.com/job-posting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Resume Version
                </label>
                <select
                  value={selectedVersionId}
                  onChange={(e) => setSelectedVersionId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a resume version...</option>
                  {availableVersions.map((version) => (
                    <option key={version.id} value={version.id}>
                      {version.label} - {new Date(version.created_at).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleTailorResume}
                disabled={loading.tailor || !selectedVersionId || (!alignJdText && !alignJdUrl)}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.tailor ? 'Tailoring...' : 'Tailor to JD'}
              </button>
            </div>

            {tailorResult && (
              <div className="mt-8 space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {tailorResult.atsScore}%
                  </div>
                  <div className="text-lg font-medium text-gray-700">ATS Score</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium mb-2">Matched Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {tailorResult.rewrittenBlocks?.flatMap((block: any) => block.matchedKeywords).slice(0, 10).map((keyword: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-medium mb-2">Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {tailorResult.rewrittenBlocks?.flatMap((block: any) => block.missingKeywords).slice(0, 10).map((keyword: string, index: number) => (
                        <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Gap Suggestions</h3>
                  <ul className="space-y-1">
                    {tailorResult.gapSuggestions?.map((suggestion: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <h3 className="font-medium mb-2">New Version Created</h3>
                  <p className="text-sm text-gray-600">
                    Version ID: <code className="bg-gray-100 px-1 rounded">{tailorResult.newVersionId}</code>
                  </p>
                  <p className="text-sm text-gray-600">
                    Label: {tailorResult.versionLabel}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'export' ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Export Resume to PDF</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Resume Version
                </label>
                <select
                  value={exportVersionId}
                  onChange={(e) => setExportVersionId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a resume version...</option>
                  {availableVersions.map((version) => (
                    <option key={version.id} value={version.id}>
                      {version.label} - {new Date(version.created_at).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template
                  </label>
                  <select
                    value={exportTemplate}
                    onChange={(e) => setExportTemplate(e.target.value as 'classic' | 'compact' | 'modern')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="classic">Classic</option>
                    <option value="compact">Compact</option>
                    <option value="modern">Modern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size: {exportFontSize}pt
                  </label>
                  <input
                    type="range"
                    min="9"
                    max="14"
                    step="0.5"
                    value={exportFontSize}
                    onChange={(e) => setExportFontSize(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Line Height: {exportLineHeight}
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="1.5"
                  step="0.05"
                  value={exportLineHeight}
                  onChange={(e) => setExportLineHeight(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeContact"
                  checked={exportIncludeContact}
                  onChange={(e) => setExportIncludeContact(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="includeContact" className="text-sm font-medium text-gray-700">
                  Include contact information
                </label>
              </div>

              {exportIncludeContact && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={exportFullName}
                        onChange={(e) => setExportFullName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Role
                      </label>
                      <input
                        type="text"
                        value={exportTargetRole}
                        onChange={(e) => setExportTargetRole(e.target.value)}
                        placeholder="e.g., Software Engineer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={exportEmail}
                        onChange={(e) => setExportEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={exportPhone}
                        onChange={(e) => setExportPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Links (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={exportLinks}
                      onChange={(e) => setExportLinks(e.target.value)}
                      placeholder="linkedin.com/in/you, github.com/you, portfolio.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
              
              <button
                onClick={handleExportPdf}
                disabled={loading.export || !exportVersionId}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.export ? 'Generating PDF...' : 'Generate PDF'}
              </button>
            </div>

            {exportResult && (
              <div className="mt-8 p-6 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-4">PDF Generated Successfully!</h3>
                <div className="space-y-2 text-sm text-green-700">
                  <p><strong>Template:</strong> {exportResult.template}</p>
                  <p><strong>File Size:</strong> {(exportResult.sizeBytes / 1024).toFixed(1)} KB</p>
                  <p><strong>Storage Path:</strong> {exportResult.storagePath}</p>
                </div>
                <div className="mt-4">
                  <a
                    href={exportResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'feedback' ? (
          <div className="flex">
            <div className="flex-1 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Resume Feedback & Comments</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Resume Version
                  </label>
                  <select
                    value={feedbackVersionId}
                    onChange={(e) => setFeedbackVersionId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a resume version...</option>
                    {availableVersions.map((version) => (
                      <option key={version.id} value={version.id}>
                        {version.label} - {new Date(version.created_at).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>

                {feedbackVersionId && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-800 mb-2">Resume Preview</h3>
                      <p className="text-sm text-blue-600">
                        Comments and feedback will appear in the sidebar. 
                        Use the "Share for Mentor Review" button to create a shareable link.
                      </p>
                    </div>
                    
                    <button
                      onClick={handleShareForReview}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
                    >
                      Share for Mentor Review
                    </button>
                    
                    {shareResult && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-medium text-green-800 mb-2">Share Link Created!</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-green-700">
                            <strong>Share URL:</strong>
                          </p>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={shareResult.url}
                              readOnly
                              className="flex-1 px-3 py-2 border border-green-300 rounded-md bg-white text-sm"
                            />
                            <button
                              onClick={() => navigator.clipboard.writeText(shareResult.url)}
                              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                            >
                              Copy
                            </button>
                          </div>
                          <p className="text-xs text-green-600">
                            This link expires in 7 days and allows mentors to review and comment on your resume.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {feedbackVersionId && (
              <CommentSidebar versionId={feedbackVersionId} />
            )}
          </div>
        ) : activeTab === 'diff' ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Version Comparison</h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version A
                  </label>
                  <select
                    value={diffVersionA?.id || ''}
                    onChange={(e) => {
                      const version = availableVersions.find(v => v.id === e.target.value);
                      setDiffVersionA(version || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select version A...</option>
                    {availableVersions.map((version) => (
                      <option key={version.id} value={version.id}>
                        {version.label} - {new Date(version.created_at).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version B
                  </label>
                  <select
                    value={diffVersionB?.id || ''}
                    onChange={(e) => {
                      const version = availableVersions.find(v => v.id === e.target.value);
                      setDiffVersionB(version || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select version B...</option>
                    {availableVersions.map((version) => (
                      <option key={version.id} value={version.id}>
                        {version.label} - {new Date(version.created_at).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <VersionDiff versionA={diffVersionA} versionB={diffVersionB} />
            </div>
          </div>
        ) : activeTab === 'analytics' ? (
          <AnalyticsDashboard />
        ) : activeTab === 'placement' ? (
          <div className="space-y-6">
            {/* Section A: Create Batch */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Create Batch</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Label
                  </label>
                  <input
                    type="text"
                    value={batchLabel}
                    onChange={(e) => setBatchLabel(e.target.value)}
                    placeholder="e.g., Summer 2024 Applications"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleCreateBatch}
                  disabled={batchLoading.create || !batchLabel}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {batchLoading.create ? 'Creating...' : 'Create Batch'}
                </button>
                {batchId && (
                  <div className="p-3 bg-green-50 rounded-md">
                    <p className="text-sm text-green-800">
                      Batch created: <code className="font-mono">{batchId}</code>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section B: Add JDs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Add Job Descriptions</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job URLs (one per line)
                  </label>
                  <textarea
                    value={jdUrls}
                    onChange={(e) => setJdUrls(e.target.value)}
                    placeholder="https://example.com/job1\nhttps://example.com/job2\n..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or upload CSV file
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    CSV format: company, role, url (or jd_text)
                  </p>
                </div>

                <button
                  onClick={handleIngestJDs}
                  disabled={batchLoading.ingest || !batchId || (!jdUrls && !csvFile)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {batchLoading.ingest ? 'Processing...' : 'Add JDs to Batch'}
                </button>

                {batchItems.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">JD Cards ({batchItems.length})</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {batchItems.map((item, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{item.company || 'Unknown Company'}</p>
                              <p className="text-sm text-gray-600">{item.role || 'Unknown Role'}</p>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.keywords?.slice(0, 3).map((keyword: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section C: Run Tailoring */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Run Tailoring</h2>
              <div className="space-y-4">
                <button
                  onClick={handleRunBatch}
                  disabled={batchLoading.run || !batchId || batchItems.length === 0}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {batchLoading.run ? 'Processing...' : `Tailor All (max ${batchItems.length})`}
                </button>

                {batchStatus && (
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Progress</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total: {batchStatus.summary?.total || 0}</span>
                        <span>Processed: {batchStatus.summary?.processed || 0}</span>
                        <span>Failed: {batchStatus.summary?.failed || 0}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${batchStatus.summary?.total ? (batchStatus.summary.processed / batchStatus.summary.total) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600">
                        Status: {batchStatus.summary?.status || 'Unknown'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section D: Export Outreach Pack */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Export Outreach Pack</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="webhook"
                    checked={webhookEnabled}
                    onChange={(e) => setWebhookEnabled(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="webhook" className="text-sm text-gray-700">
                    Emit n8n webhook per item
                  </label>
                </div>

                <button
                  onClick={handleExportBatch}
                  disabled={batchLoading.export || !batchId}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {batchLoading.export ? 'Generating...' : 'Export ZIP'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
          {/* Parse Job Description Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Parse Job Description</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description Text
                </label>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste job description here..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job URL (Optional)
                </label>
                <input
                  type="url"
                  value={jdUrl}
                  onChange={(e) => setJdUrl(e.target.value)}
                  placeholder="https://example.com/job-posting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={handleJDParse}
                disabled={loading.jd || (!jdText && !jdUrl)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.jd ? 'Extracting...' : 'Extract Skills & Keywords'}
              </button>
            </div>

            {jdResult && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Extracted Skills:</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {jdResult.skills?.map((skill: string, index: number) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                <h3 className="font-medium mb-2">Keywords:</h3>
                <div className="flex flex-wrap gap-2">
                  {jdResult.keywords?.map((keyword: string, index: number) => (
                    <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Draft Resume Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Draft Resume</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Me / Profile
                </label>
                <textarea
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  placeholder="Describe your background, experience, and skills..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Role (Optional)
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={handleResumeDraft}
                disabled={loading.resume || !profileText}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.resume ? 'Drafting...' : 'Draft Resume'}
              </button>
            </div>

            {resumeResult && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Generated Resume:</h3>
                  <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
                    {JSON.stringify(resumeResult.version.content, null, 2)}
                  </pre>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-md">
                  <h3 className="font-medium mb-2">AI Rationale:</h3>
                  <p className="text-sm text-gray-700">{resumeResult.rationale}</p>
                </div>
                
                <button
                  onClick={handleExportPDF}
                  disabled={true}
                  className="w-full bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed"
                  title="Coming in Phase 4"
                >
                  Export PDF (Coming in Phase 4)
                </button>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
