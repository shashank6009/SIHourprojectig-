'use client';

import { useState, useEffect } from 'react';
import { http } from '@/lib/http';
import { ConsentScope } from '@/lib/consent';

interface ConsentStatus {
  [key: string]: {
    granted: boolean;
    version?: string;
    region?: string;
  };
}

interface VaultItem {
  id: string;
  kind: string;
  data: any;
}

export default function PrivacySettingsPage() {
  const [consents, setConsents] = useState<ConsentStatus>({});
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState({ consents: false, vault: false, dsr: false });
  const [newPiiData, setNewPiiData] = useState({ kind: '', data: '' });
  const [dsrStatus, setDsrStatus] = useState<any>(null);

  // Load initial data
  useEffect(() => {
    loadConsents();
    loadVaultItems();
  }, []);

  const loadConsents = async () => {
    setLoading(prev => ({ ...prev, consents: true }));
    try {
      // For now, mock the consent data - in real implementation, fetch from API
      const mockConsents: ConsentStatus = {
        LLM_PROCESSING: { granted: false, version: '2025-09-28', region: 'IN' },
        OUTREACH_EMAIL: { granted: false, version: '2025-09-28', region: 'IN' },
        CALENDAR_EVENTS: { granted: false, version: '2025-09-28', region: 'IN' },
        OFFSHORE_STORAGE: { granted: false, version: '2025-09-28', region: 'IN' },
        ANALYTICS: { granted: false, version: '2025-09-28', region: 'IN' },
      };
      setConsents(mockConsents);
    } catch (error) {
      console.error('Failed to load consents:', error);
    } finally {
      setLoading(prev => ({ ...prev, consents: false }));
    }
  };

  const loadVaultItems = async () => {
    setLoading(prev => ({ ...prev, vault: true }));
    try {
      // For now, mock the vault data - in real implementation, fetch from API
      const mockVaultItems: VaultItem[] = [
        { id: '1', kind: 'contact', data: { email: 'user@example.com', phone: '+1234567890' } },
        { id: '2', kind: 'education_doc', data: { degree: 'Bachelor of Science', university: 'Example University' } },
      ];
      setVaultItems(mockVaultItems);
    } catch (error) {
      console.error('Failed to load vault items:', error);
    } finally {
      setLoading(prev => ({ ...prev, vault: false }));
    }
  };

  const toggleConsent = async (scope: ConsentScope) => {
    try {
      const currentStatus = consents[scope]?.granted || false;
      const newStatus = !currentStatus;
      
      // In real implementation, call API to update consent
      console.log(`Toggling consent for ${scope} to ${newStatus}`);
      
      setConsents(prev => ({
        ...prev,
        [scope]: {
          ...prev[scope],
          granted: newStatus,
        },
      }));
    } catch (error) {
      console.error('Failed to update consent:', error);
      alert('Failed to update consent');
    }
  };

  const addPiiData = async () => {
    if (!newPiiData.kind || !newPiiData.data) {
      alert('Please fill in both kind and data fields');
      return;
    }

    try {
      // In real implementation, call API to store in vault
      console.log('Adding PII data:', newPiiData);
      
      const newItem: VaultItem = {
        id: Date.now().toString(),
        kind: newPiiData.kind,
        data: JSON.parse(newPiiData.data),
      };
      
      setVaultItems(prev => [...prev, newItem]);
      setNewPiiData({ kind: '', data: '' });
    } catch (error) {
      console.error('Failed to add PII data:', error);
      alert('Failed to add PII data');
    }
  };

  const deleteVaultItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      // In real implementation, call API to delete from vault
      console.log('Deleting vault item:', itemId);
      
      setVaultItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to delete vault item:', error);
      alert('Failed to delete vault item');
    }
  };

  const exportData = async () => {
    setLoading(prev => ({ ...prev, dsr: true }));
    try {
      const response = await http.post('/api/dsr/export', {});
      
      if (response.data.success) {
        setDsrStatus({
          type: 'export',
          status: 'done',
          downloadUrl: response.data.downloadUrl,
        });
        alert('Data export completed! Check the download link below.');
      } else {
        alert('Export failed');
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data');
    } finally {
      setLoading(prev => ({ ...prev, dsr: false }));
    }
  };

  const deleteData = async () => {
    if (!confirm('Are you sure you want to delete ALL your data? This action cannot be undone.')) {
      return;
    }

    if (!confirm('This will permanently delete all your resumes, comments, batches, and personal data. Are you absolutely sure?')) {
      return;
    }

    setLoading(prev => ({ ...prev, dsr: true }));
    try {
      const response = await http.post('/api/dsr/delete', { confirm: true });
      
      if (response.data.success) {
        setDsrStatus({
          type: 'delete',
          status: 'done',
          deletionSummary: response.data.deletionSummary,
        });
        alert('Data deletion completed!');
      } else {
        alert('Deletion failed');
      }
    } catch (error) {
      console.error('Failed to delete data:', error);
      alert('Failed to delete data');
    } finally {
      setLoading(prev => ({ ...prev, dsr: false }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Settings</h1>

        {/* Section A: Consent Toggles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Consent Management</h2>
          <p className="text-sm text-gray-600 mb-6">
            Policy Version: {process.env.NEXT_PUBLIC_POLICY_VERSION || '2025-09-28'} | 
            Region: {process.env.NEXT_PUBLIC_PRIVACY_DEFAULT_REGION || 'IN'}
          </p>
          
          <div className="space-y-4">
            {Object.entries(consents).map(([scope, status]) => (
              <div key={scope} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{scope.replace(/_/g, ' ')}</h3>
                  <p className="text-sm text-gray-600">
                    Version: {status.version} | Region: {status.region}
                  </p>
                </div>
                <button
                  onClick={() => toggleConsent(scope as ConsentScope)}
                  className={`px-4 py-2 rounded-md font-medium ${
                    status.granted
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {status.granted ? 'Granted' : 'Not Granted'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section B: PII Manager */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">PII Manager</h2>
          
          {/* Add new PII data */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Add Personal Information</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Kind (e.g., contact, education_doc)"
                value={newPiiData.kind}
                onChange={(e) => setNewPiiData(prev => ({ ...prev, kind: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Data (JSON format, e.g., {&quot;email&quot;: &quot;user@example.com&quot;})"
                value={newPiiData.data}
                onChange={(e) => setNewPiiData(prev => ({ ...prev, data: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <button
                onClick={addPiiData}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Add to Vault
              </button>
            </div>
          </div>

          {/* Display vault items */}
          <div className="space-y-3">
            {vaultItems.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{item.kind}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(item.data, null, 2))}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => deleteVaultItem(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(item.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Section C: Data Controls */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Data Controls</h2>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Export My Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Download a complete copy of all your data including resumes, comments, and personal information.
              </p>
              <button
                onClick={exportData}
                disabled={loading.dsr}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading.dsr ? 'Exporting...' : 'Export My Data'}
              </button>
              {dsrStatus?.type === 'export' && dsrStatus.status === 'done' && (
                <div className="mt-3 p-3 bg-green-50 rounded-md">
                  <p className="text-sm text-green-800">Export completed!</p>
                  <a
                    href={dsrStatus.downloadUrl}
                    className="text-sm text-green-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download your data
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h3 className="font-medium mb-2 text-red-800">Delete My Data</h3>
              <p className="text-sm text-red-600 mb-3">
                <strong>Warning:</strong> This will permanently delete all your data. This action cannot be undone.
              </p>
              <button
                onClick={deleteData}
                disabled={loading.dsr}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading.dsr ? 'Deleting...' : 'Delete All My Data'}
              </button>
              {dsrStatus?.type === 'delete' && dsrStatus.status === 'done' && (
                <div className="mt-3 p-3 bg-red-100 rounded-md">
                  <p className="text-sm text-red-800">Data deletion completed!</p>
                  <p className="text-xs text-red-600">
                    Deleted: {Object.entries(dsrStatus.deletionSummary || {})
                      .map(([key, count]) => `${key}: ${count}`)
                      .join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section D: Policy Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Privacy Policy</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Current Policy Version: <strong>{process.env.NEXT_PUBLIC_POLICY_VERSION || '2025-09-28'}</strong>
            </p>
            <a
              href={`/policy/${process.env.NEXT_PUBLIC_POLICY_VERSION || '2025-09-28'}`}
              className="text-blue-600 hover:underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
