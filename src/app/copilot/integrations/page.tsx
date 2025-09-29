'use client';

import { useState, useEffect } from 'react';
import { http } from '@/lib/http';
import ReferralGraph from '@/components/copilot/ReferralGraph';

interface ConnectionStatus {
  gmail: boolean;
  calendar: boolean;
}

interface ReferralData {
  people: Array<{
    id: string;
    name: string;
    company?: string;
    role?: string;
    relationship?: string;
    strength: number;
  }>;
  companies: Array<{
    id: string;
    name: string;
    count: number;
  }>;
}

export default function IntegrationsPage() {
  const [connections, setConnections] = useState<ConnectionStatus>({ gmail: false, calendar: false });
  const [referrals, setReferrals] = useState<ReferralData>({ people: [], companies: [] });
  const [loading, setLoading] = useState({ gmail: false, calendar: false, test: false, import: false });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [atsUrl, setAtsUrl] = useState('');
  const [atsInfo, setAtsInfo] = useState<any>(null);
  const [atsLoading, setAtsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadReferrals();
    checkConnections();
  }, []);

  const loadReferrals = async () => {
    try {
      const response = await http.get('/api/referrals/list');
      const data = response.data.referrals || [];
      
      // Transform data for graph
      const people = data.map((ref: any) => ({
        id: ref.id,
        name: ref.person_name,
        company: ref.company,
        role: ref.role,
        relationship: ref.relationship,
        strength: ref.strength,
      }));

      // Group by company
      const companyMap = new Map();
      people.forEach((person: any) => {
        if (person.company) {
          const existing = companyMap.get(person.company) || { id: person.company, name: person.company, count: 0 };
          existing.count++;
          companyMap.set(person.company, existing);
        }
      });

      setReferrals({
        people,
        companies: Array.from(companyMap.values()),
      });
    } catch (error) {
      console.error('Failed to load referrals:', error);
    }
  };

  const checkConnections = async () => {
    // For now, assume connections are not established
    // In a real implementation, you'd check the database for valid tokens
    setConnections({ gmail: false, calendar: false });
  };

  const connectGmail = async () => {
    setLoading(prev => ({ ...prev, gmail: true }));
    try {
      const response = await http.get('/api/integrations/google/start?scope=gmail');
      window.open(response.data.authUrl, '_blank');
    } catch (error) {
      console.error('Failed to start Gmail OAuth:', error);
    } finally {
      setLoading(prev => ({ ...prev, gmail: false }));
    }
  };

  const connectCalendar = async () => {
    setLoading(prev => ({ ...prev, calendar: true }));
    try {
      const response = await http.get('/api/integrations/google/start?scope=calendar');
      window.open(response.data.authUrl, '_blank');
    } catch (error) {
      console.error('Failed to start Calendar OAuth:', error);
    } finally {
      setLoading(prev => ({ ...prev, calendar: false }));
    }
  };

  const testEmailDraft = async () => {
    setLoading(prev => ({ ...prev, test: true }));
    try {
      await http.post('/api/push/draft', {
        to: 'test@example.com',
        subject: 'Test Draft',
        body: 'This is a test email draft.',
      });
      alert('Test draft created successfully!');
    } catch (error) {
      console.error('Failed to create test draft:', error);
      alert('Failed to create test draft');
    } finally {
      setLoading(prev => ({ ...prev, test: false }));
    }
  };

  const scheduleTestEvent = async () => {
    setLoading(prev => ({ ...prev, test: true }));
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      await http.post('/api/push/calendar', {
        title: 'Test Follow-up',
        datetimeISO: tomorrow.toISOString(),
        notes: 'This is a test calendar event.',
      });
      alert('Test event scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule test event:', error);
      alert('Failed to schedule test event');
    } finally {
      setLoading(prev => ({ ...prev, test: false }));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(prev => ({ ...prev, import: true }));
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/referrals/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        alert(`Successfully imported ${result.imported} referrals`);
        loadReferrals();
      } else {
        alert(`Import failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to import referrals:', error);
      alert('Failed to import referrals');
    } finally {
      setLoading(prev => ({ ...prev, import: false }));
    }
  };

  const inspectATS = async () => {
    if (!atsUrl) return;

    setAtsLoading(true);
    try {
      const response = await http.post('/api/ats/inspect', { jdUrl: atsUrl });
      setAtsInfo(response.data);
    } catch (error) {
      console.error('Failed to inspect ATS:', error);
      alert('Failed to inspect ATS');
    } finally {
      setAtsLoading(false);
    }
  };

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  const draftIntro = async () => {
    if (!selectedNode || selectedNode.type !== 'person') return;

    const company = prompt('Enter company name:');
    const role = prompt('Enter role:');
    const recruiterEmail = prompt('Enter recruiter email (optional):');

    if (!company || !role) return;

    try {
      const response = await http.post('/api/referrals/intro', {
        referralId: selectedNode.id,
        company,
        role,
        recruiterEmail: recruiterEmail || undefined,
      });

      alert(`Intro draft created:\n\nSubject: ${response.data.subject}\n\nBody: ${response.data.body}`);
    } catch (error) {
      console.error('Failed to create intro draft:', error);
      alert('Failed to create intro draft');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>

        {/* Section A: Connections */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Connections</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gmail Connection */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Gmail</h3>
                  <p className="text-sm text-gray-600">Send email drafts</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  connections.gmail ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {connections.gmail ? 'Connected' : 'Not Connected'}
                </div>
              </div>
              <button
                onClick={connectGmail}
                disabled={loading.gmail || connections.gmail}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.gmail ? 'Connecting...' : connections.gmail ? 'Connected' : 'Connect Gmail'}
              </button>
            </div>

            {/* Calendar Connection */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Google Calendar</h3>
                  <p className="text-sm text-gray-600">Schedule follow-ups</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  connections.calendar ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {connections.calendar ? 'Connected' : 'Not Connected'}
                </div>
              </div>
              <button
                onClick={connectCalendar}
                disabled={loading.calendar || connections.calendar}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.calendar ? 'Connecting...' : connections.calendar ? 'Connected' : 'Connect Calendar'}
              </button>
            </div>
          </div>

          {/* Test Actions */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-4">Test Actions</h3>
            <div className="flex gap-4">
              <button
                onClick={testEmailDraft}
                disabled={loading.test}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading.test ? 'Testing...' : 'Test Email Draft'}
              </button>
              <button
                onClick={scheduleTestEvent}
                disabled={loading.test}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loading.test ? 'Testing...' : 'Test Calendar Event'}
              </button>
            </div>
          </div>
        </div>

        {/* Section B: Referrals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Referral Network</h2>
          
          {/* CSV Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Import Referrals (CSV)
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={loading.import}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              CSV format: person_name, email, company, role, relationship, strength, notes
            </p>
          </div>

          {/* Referral Graph */}
          <ReferralGraph data={referrals} onNodeClick={handleNodeClick} />

          {/* Selected Node Actions */}
          {selectedNode && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Selected: {selectedNode.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {selectedNode.type === 'person' ? 'Person' : 'Company'} • {selectedNode.company || 'No company'}
              </p>
              {selectedNode.type === 'person' && (
                <button
                  onClick={draftIntro}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Draft Introduction
                </button>
              )}
            </div>
          )}
        </div>

        {/* Section C: Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Draft Recruiter Email</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create a draft email with your latest tailored resume links
              </p>
              <button
                onClick={() => {
                  const to = prompt('Recruiter email:');
                  const subject = prompt('Subject:');
                  if (to && subject) {
                    http.post('/api/push/draft', {
                      to,
                      subject,
                      body: 'Hi,\n\nI hope this email finds you well. I am writing to express my interest in the position and have attached my tailored resume for your review.\n\nBest regards,\n[Your Name]',
                    }).then(() => alert('Draft created!')).catch(() => alert('Failed to create draft'));
                  }
                }}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Create Draft
              </button>
            </div>
            <div>
              <h3 className="font-medium mb-2">Schedule Follow-up</h3>
              <p className="text-sm text-gray-600 mb-4">
                Schedule a follow-up reminder in 3 days
              </p>
              <button
                onClick={() => {
                  const title = prompt('Event title:');
                  if (title) {
                    const date = new Date();
                    date.setDate(date.getDate() + 3);
                    date.setHours(10, 0, 0, 0);
                    
                    http.post('/api/push/calendar', {
                      title,
                      datetimeISO: date.toISOString(),
                      notes: 'Follow-up reminder for job application',
                    }).then(() => alert('Follow-up scheduled!')).catch(() => alert('Failed to schedule follow-up'));
                  }
                }}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
              >
                Schedule Follow-up
              </button>
            </div>
          </div>
        </div>

        {/* Section D: ATS Helper */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">ATS Helper</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={atsUrl}
                  onChange={(e) => setAtsUrl(e.target.value)}
                  placeholder="https://example.com/job-posting"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={inspectATS}
                  disabled={atsLoading || !atsUrl}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {atsLoading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            </div>

            {atsInfo && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">ATS Analysis</h3>
                <div className="space-y-2">
                  <p><strong>Platform:</strong> {atsInfo.ats}</p>
                  <p><strong>Apply URL:</strong> <a href={atsInfo.applyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{atsInfo.applyUrl}</a></p>
                  <div>
                    <strong>Checklist:</strong>
                    <ul className="mt-1 list-disc list-inside text-sm">
                      {atsInfo.checklist.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
