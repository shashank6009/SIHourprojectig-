"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MLService } from "@/lib/mlService";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function MLApiTestPage() {
  const [healthStatus, setHealthStatus] = useState<Record<string, unknown> | null>(null);
  const [testRecommendations, setTestRecommendations] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testHealthCheck = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const health = await MLService.healthCheck();
      setHealthStatus(health as Record<string, unknown>);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Health check failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testRecommendationsAPI = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sampleProfile = {
        student_id: "test_user_123",
        skills: ["Python", "JavaScript", "React", "Node.js", "Machine Learning", "Data Analysis"],
        stream: "Computer Science",
        cgpa: 8.5,
        rural_urban: "Urban",
        college_tier: "Tier-2",
        // Optional fields for internal use
        name: "Test Student",
        email: "test@example.com",
        university: "Test University",
        degree: "Computer Science",
        course: "B.Tech",
        graduation_year: "2025",
        current_status: "Student",
        work_experience: "0-1 years",
        languages: ["English", "Hindi"],
        preferred_location: "Delhi",
        preferred_duration: "3 months",
        preferred_domains: ["Software Development", "Data Science"],
        career_objective: "To work in a challenging environment that allows me to grow professionally"
      };

      const recommendations = await MLService.getRecommendations(sampleProfile, 5);
      setTestRecommendations(recommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recommendations test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gov-navy mb-8">ML API Integration Test</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Health Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testHealthCheck}
                disabled={isLoading}
                className="w-full mb-4 bg-gov-saffron hover:bg-gov-saffron/90"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Health Check"
                )}
              </Button>
              
              {healthStatus && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">API Status</h3>
                  <pre className="text-sm text-green-700 whitespace-pre-wrap">
                    {JSON.stringify(healthStatus, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Recommendations Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testRecommendationsAPI}
                disabled={isLoading}
                className="w-full mb-4 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Recommendations"
                )}
              </Button>
              
              {testRecommendations && (
                <div className="bg-blue-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Recommendations ({testRecommendations.total_recommendations})
                  </h3>
                  <div className="space-y-2">
                    {testRecommendations.recommendations?.slice(0, 3).map((rec: Record<string, unknown>, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded border">
                        <div className="font-medium">{rec.title}</div>
                        <div className="text-sm text-gray-600">{rec.organization_name}</div>
                        <div className="text-sm text-blue-600">
                          Success: {Math.round(rec.scores?.success_probability * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Details */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Base URL:</strong> https://web-production-c72b1.up.railway.app
                </div>
                <div>
                  <strong>Health Endpoint:</strong> /health
                </div>
                <div>
                  <strong>Recommendations Endpoint:</strong> /recommendations
                </div>
                <div>
                  <strong>Timeout:</strong> 10 seconds
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
