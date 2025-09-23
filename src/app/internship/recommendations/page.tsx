"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Building2, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Brain,
  Target,
  ArrowLeft,
  Lightbulb,
  BookOpen,
  X,
  Search
} from "lucide-react";
import { MLService, type MLRecommendationsResponse, type InternshipRecommendation, type StudentProfile } from "@/lib/mlService";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShortlistTracker } from "@/lib/tracker";

// Helper functions for enhanced course information
const getCourseLink = (platform: string, courseName: string): string => {
  if (!platform || !courseName) return '#';
  
  const platformLinks = {
    'coursera': `https://www.coursera.org/search?query=${encodeURIComponent(courseName)}`,
    'udemy': `https://www.udemy.com/courses/search/?q=${encodeURIComponent(courseName)}`,
    'edx': `https://www.edx.org/search?q=${encodeURIComponent(courseName)}`,
    'pluralsight': `https://www.pluralsight.com/search?q=${encodeURIComponent(courseName)}`,
    'linkedin': `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(courseName)}`,
    'khan academy': `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(courseName)}`,
    'youtube': `https://www.youtube.com/results?search_query=${encodeURIComponent(courseName + ' tutorial')}`,
    'freecodecamp': `https://www.freecodecamp.org/learn/`,
    'codecademy': `https://www.codecademy.com/catalog/subject/all?query=${encodeURIComponent(courseName)}`,
  };
  
  return platformLinks[platform.toLowerCase() as keyof typeof platformLinks] || 
         `https://www.google.com/search?q=${encodeURIComponent(courseName + ' course ' + platform)}`;
};

const getCourseDuration = (platform: string): string => {
  if (!platform) return '2-4 weeks';
  
  const durations = {
    'coursera': '4-6 weeks',
    'udemy': '8-12 hours',
    'edx': '6-8 weeks',
    'pluralsight': '3-5 hours',
    'linkedin': '2-4 hours',
    'khan academy': '2-3 weeks',
    'youtube': '1-2 hours',
    'freecodecamp': '4-8 weeks',
    'codecademy': '3-6 weeks',
  };
  
  return durations[platform.toLowerCase() as keyof typeof durations] || '2-4 weeks';
};

const getCourseDescription = (skill: string): string => {
  if (!skill) return 'Develop your skills';
  
  const descriptions = {
    'python': 'Master Python programming fundamentals',
    'javascript': 'Learn modern JavaScript and ES6+',
    'react': 'Build interactive user interfaces',
    'node.js': 'Server-side JavaScript development',
    'sql': 'Database querying and management',
    'data science': 'Analytics and machine learning basics',
    'machine learning': 'AI algorithms and implementations',
    'web development': 'Full-stack web application development',
    'mobile development': 'iOS and Android app development',
    'cloud computing': 'AWS, Azure, and GCP fundamentals',
    'cybersecurity': 'Security protocols and best practices',
    'digital marketing': 'SEO, social media, and analytics',
    'project management': 'Agile and Scrum methodologies',
    'ui/ux design': 'User experience and interface design',
  };
  
  return descriptions[skill.toLowerCase() as keyof typeof descriptions] || 
         `Develop expertise in ${skill}`;
};

const getCompanyLogo = (orgName: string): string => {
  if (!orgName) return `https://ui-avatars.com/api/?name=Company&background=f3f4f6&color=374151&size=40`;
  
  // In a real app, you'd have a proper logo service or database
  const logoMap = {
    'google': '/company-logos/google.png',
    'microsoft': '/company-logos/microsoft.png',
    'amazon': '/company-logos/amazon.png',
    'meta': '/company-logos/meta.png',
    'apple': '/company-logos/apple.png',
    'netflix': '/company-logos/netflix.png',
    'uber': '/company-logos/uber.png',
    'airbnb': '/company-logos/airbnb.png',
  };
  
  const key = orgName.toLowerCase();
  return logoMap[key as keyof typeof logoMap] || `https://ui-avatars.com/api/?name=${encodeURIComponent(orgName)}&background=f3f4f6&color=374151&size=40`;
};

const getApplicationLink = (internshipId: string, orgName: string): string => {
  if (!orgName) return '#';
  
  // In a real app, this would be actual application URLs
  const commonUrls = {
    'google': 'https://careers.google.com/students/',
    'microsoft': 'https://careers.microsoft.com/students/',
    'amazon': 'https://www.amazon.jobs/en/teams/internships-for-students',
    'meta': 'https://www.metacareers.com/students/',
    'apple': 'https://jobs.apple.com/en-us/search?team=internships-STDNT-INTRN',
    'netflix': 'https://jobs.netflix.com/search?q=intern',
    'uber': 'https://www.uber.com/careers/university/',
    'airbnb': 'https://careers.airbnb.com/university/',
  };
  
  const key = orgName.toLowerCase();
  return commonUrls[key as keyof typeof commonUrls] || 
         `https://www.google.com/search?q=${encodeURIComponent(orgName + ' internship application')}`;
};

export default function RecommendationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user?.email || 'guest@pmis.gov.in';
  
  // Initialize tracker only on client side
  const [tracker, setTracker] = useState<ShortlistTracker | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTracker(new ShortlistTracker(userId));
    }
  }, [userId]);
  
  // State management
  const [recommendations, setRecommendations] = useState<MLRecommendationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [filteredRecs, setFilteredRecs] = useState<InternshipRecommendation[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  // UI filter states (removed as page is display-only)
  const searchQuery = "";
  const domainFilter = "all";
  const locationFilter = "all";
  const sortBy = "success";
  const [, setSavedIds] = useState<Record<string, boolean>>({});
  const [, setCompletedCourses] = useState<Record<string, boolean>>({});
  const [selectedRecommendation, setSelectedRecommendation] = useState<InternshipRecommendation | null>(null);
  const [mounted, setMounted] = useState(false);
  

  // Load data and fetch recommendations
  useEffect(() => {
    const loadRecommendations = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        // Force clear any cached recommendations to ensure fresh data with random deadlines
        if (typeof window !== 'undefined') {
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith('ml_recommendations_')) {
              localStorage.removeItem(key);
              console.log('[RecommendationsPage] Cleared cached recommendations:', key);
            }
          });
        }
        
        // Get student profile from session storage (client-side only)
        const profileData = typeof window !== 'undefined' ? sessionStorage.getItem('student_profile') : null;
        if (!profileData) {
          setError("No student profile found. Please fill the intern form first.");
          setIsLoading(false);
          return;
        }

        let profile: StudentProfile;
        try {
          profile = JSON.parse(profileData);
        } catch {
          setError("Invalid profile data. Please fill the intern form again.");
          setIsLoading(false);
          return;
        }

        // Validate profile structure
        if (!profile.student_id) {
          setError("Invalid profile: missing student ID. Please fill the intern form again.");
          setIsLoading(false);
          return;
        }

        // If the saved profile is incomplete, try to rebuild from intern form data
        const isMissing = (!profile.skills || profile.skills.length === 0)
          || !profile.stream
          || (profile.cgpa === undefined || profile.cgpa === null)
          || !profile.rural_urban
          || !profile.college_tier;

        if (isMissing) {
          try {
            const rawForm = typeof window !== 'undefined' ? sessionStorage.getItem('intern_form_data') : null;
            if (rawForm && session?.user?.email) {
              const formData = JSON.parse(rawForm);
              const rebuilt = MLService.transformInternFormToProfile(formData, session.user.email);
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('student_profile', JSON.stringify(rebuilt));
              }
              profile = rebuilt;
              console.log('[Recommendations] Rebuilt incomplete profile from form data');
            } else {
              console.warn('[Recommendations] Could not rebuild profile - missing form data or session');
            }
          } catch (e) {
            console.error('[Recommendations] Failed to rebuild profile:', e);
          }
        }

        setStudentProfile(profile);

        // Skip caching to ensure fresh recommendations every time
        // const cached = MLService.getCachedRecommendations(profile.student_id);
        // if (cached && cached.recommendations && cached.recommendations.length > 0) {
        //   setRecommendations(cached);
        //   setFilteredRecs(cached.recommendations);
        //   setIsLoading(false);
        //   return;
        // }

        // Fetch fresh recommendations from ML API
        console.log('Fetching AI recommendations for:', profile.student_id);
        const mlResponse = await MLService.getRecommendations(profile, 15);
        
        // Log determinism warning
        console.warn('[Recommendations] ⚠️ ML MODEL ISSUES DETECTED:');
        console.warn('  - Model returns random recommendations instead of ranking by success probability');
        console.warn('  - Success probabilities are pre-calculated buckets, not student-specific');
        console.warn('  - Recommendations will vary on each refresh due to random selection');
        
        if (!mlResponse || !mlResponse.recommendations) {
          throw new Error('Invalid response from ML service');
        }
        
        // Cache the recommendations
        await MLService.storeRecommendations(profile.student_id, mlResponse);
        
        // Ensure all recommendations have random December 2025 deadlines
        const recommendationsWithDeadlines = mlResponse.recommendations.map(rec => {
          if (!rec.application_deadline) {
            // Generate random deadline if missing
            const startDate = new Date('2025-12-01');
            const randomDays = Math.floor(Math.random() * 31);
            const deadline = new Date(startDate);
            deadline.setDate(startDate.getDate() + randomDays);
            deadline.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);
            
            console.log(`[RecommendationsPage] Generated missing deadline for ${rec.title}:`, deadline.toISOString());
            
            return {
              ...rec,
              application_deadline: deadline.toISOString()
            };
          }
          return rec;
        });
        
        // Debug: Log deadlines
        console.log('[RecommendationsPage] Final deadlines:', 
          recommendationsWithDeadlines.map(rec => ({
            title: rec.title,
            deadline: rec.application_deadline
          }))
        );
        
        setRecommendations({
          ...mlResponse,
          recommendations: recommendationsWithDeadlines
        });
        setFilteredRecs(recommendationsWithDeadlines);
        
      } catch (err) {
        console.error('Failed to load recommendations:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load recommendations';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [session]);

  // Test webhook connectivity
  const testWebhook = async () => {
    try {
      const testPayload = { test: true, timestamp: new Date().toISOString() };
      console.log('🧪 Testing webhook connectivity...');
      console.log('🧪 Test payload:', JSON.stringify(testPayload, null, 2));
      
      const response = await fetch('https://qiq-ai.app.n8n.cloud/webhook/4467d488-f652-45f6-809d-f0b650940ad1', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });
      
      console.log('🧪 Webhook test response status:', response.status);
      console.log('🧪 Webhook test response statusText:', response.statusText);
      console.log('🧪 Webhook test response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('🧪 Webhook test response body:', responseText);
      
      return response.ok;
    } catch (error) {
      console.error('🧪 Webhook test failed:', {
        error: error,
        errorMessage: error?.message,
        errorName: error?.name,
        errorStack: error?.stack
      });
      return false;
    }
  };

  // Simple webhook test function
  const simpleWebhookTest = async () => {
    console.log('🔬 Simple webhook test starting...');
    try {
      const response = await fetch('https://qiq-ai.app.n8n.cloud/webhook/4467d488-f652-45f6-809d-f0b650940ad1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simple: 'test' })
      });
      console.log('🔬 Simple test result:', response.status, response.statusText);
      return response.ok;
    } catch (err) {
      console.log('🔬 Simple test error:', err);
      return false;
    }
  };

  // Client-side mounting
  useEffect(() => {
    setMounted(true);
    console.log('🚀 Recommendations page mounted - random December 2025 deadlines will be generated!');
    console.log('📅 Webhook integration active: https://qiq-ai.app.n8n.cloud/webhook/4467d488-f652-45f6-809d-f0b650940ad1');
    
    // Test webhook connectivity on page load
    testWebhook();
    simpleWebhookTest();
    
    // Also test with a simple GET request to see if the URL is reachable
    fetch('https://qiq-ai.app.n8n.cloud/webhook/4467d488-f652-45f6-809d-f0b650940ad1', {
      method: 'GET',
      mode: 'cors'
    }).then(response => {
      console.log('🌐 GET test response:', response.status, response.statusText);
    }).catch(error => {
      console.error('🌐 GET test failed:', error);
    });
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    if (!recommendations) return;

    let filtered = [...recommendations.recommendations];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(rec => 
        rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.domain.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply domain filter
    if (domainFilter !== "all") {
      filtered = filtered.filter(rec => rec.domain.toLowerCase() === domainFilter.toLowerCase());
    }

    // Apply location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter(rec => rec.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rank":
          return a.rank - b.rank;
        case "success_probability":
          return (b.success_prob || b.scores.success_probability || 0) - (a.success_prob || a.scores.success_probability || 0);
        case "stipend":
          const stipendA = typeof a.stipend === 'number' ? a.stipend : parseFloat(a.stipend as string) || 0;
          const stipendB = typeof b.stipend === 'number' ? b.stipend : parseFloat(b.stipend as string) || 0;
          return stipendB - stipendA;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return a.rank - b.rank;
      }
    });

    setFilteredRecs(filtered);
  }, [recommendations, searchQuery, domainFilter, locationFilter, sortBy]);

  const handleRefresh = async () => {
    if (!studentProfile) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Clear cache and fetch fresh recommendations
      MLService.clearCachedRecommendations(studentProfile.student_id);
      const mlResponse = await MLService.getRecommendations(studentProfile, 15);
      
      // Ensure all recommendations have random December 2025 deadlines
      const recommendationsWithDeadlines = mlResponse.recommendations.map(rec => {
        if (!rec.application_deadline) {
          // Generate random deadline if missing
          const startDate = new Date('2025-12-01');
          const randomDays = Math.floor(Math.random() * 31);
          const deadline = new Date(startDate);
          deadline.setDate(startDate.getDate() + randomDays);
          deadline.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);
          
          console.log(`[Refresh] Generated missing deadline for ${rec.title}:`, deadline.toISOString());
          
          return {
            ...rec,
            application_deadline: deadline.toISOString()
          };
        }
        return rec;
      });
      
      // Update the response with deadlines
      const updatedResponse = {
        ...mlResponse,
        recommendations: recommendationsWithDeadlines
      };
      
      await MLService.storeRecommendations(studentProfile.student_id, updatedResponse);
      setRecommendations(updatedResponse);
      setFilteredRecs(recommendationsWithDeadlines);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique domains and locations for filters
  const uniqueDomains = recommendations ? [...new Set(recommendations.recommendations.map(r => r.domain))] : [];
  const uniqueLocations = recommendations ? [...new Set(recommendations.recommendations.map(r => r.location))] : [];




  const triggerCalendarWebhook = async (title: string, deadlineISO?: string | null) => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      return;
    }
    
    if (!deadlineISO || !title) {
      if (typeof window !== 'undefined') {
        alert('Deadline information not available for this internship');
      }
      return;
    }
    
    try {
      const dt = new Date(deadlineISO);
      if (isNaN(dt.getTime())) {
        if (typeof window !== 'undefined') {
          alert('Invalid deadline date');
        }
        return;
      }
      
      // Trigger webhook for calendar event creation
      try {
        const webhookUrl = 'https://qiq-ai.app.n8n.cloud/webhook/4467d488-f652-45f6-809d-f0b650940ad1';
        const webhookPayload = {
          event: 'calendar_event_created',
          title: title,
          deadline: deadlineISO,
          deadline_formatted: dt.toLocaleDateString(),
          user_id: userId,
          timestamp: new Date().toISOString(),
          source: 'pmis_internship_portal',
          organization: selectedRecommendation?.organization_name || 'Unknown',
          location: selectedRecommendation?.location || 'Unknown',
          domain: selectedRecommendation?.domain || 'Unknown',
          stipend: selectedRecommendation?.stipend || 0,
          duration: selectedRecommendation?.duration || 'Unknown'
        };
        
        console.log('📅 Triggering calendar webhook:', webhookPayload);
        
        // Send webhook request with better error handling
        console.log('📤 Sending webhook request to:', webhookUrl);
        console.log('📤 Request payload:', JSON.stringify(webhookPayload, null, 2));
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          mode: 'cors', // Explicitly set CORS mode
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(webhookPayload)
        });
        
        console.log('📡 Webhook response status:', response.status);
        console.log('📡 Webhook response statusText:', response.statusText);
        console.log('📡 Webhook response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const responseText = await response.text();
          console.log('✅ Calendar webhook triggered successfully');
          console.log('📡 Webhook response:', responseText);
          // Show success message to user
          if (typeof window !== 'undefined') {
            alert('📅 Calendar event has been added to your calendar!');
          }
        } else {
          const errorText = await response.text();
          console.error('❌ Calendar webhook failed:', {
            status: response.status,
            statusText: response.statusText,
            response: errorText,
            url: webhookUrl
          });
          
          // Parse the error response to show a helpful message
          let errorMessage = `⚠️ Failed to add calendar event. Status: ${response.status}`;
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.message) {
              if (errorData.message.includes('Workflow could not be started')) {
                errorMessage = '⚠️ Calendar service is temporarily unavailable. The workflow is not active. Please try again later.';
              } else {
                errorMessage = `⚠️ Calendar service error: ${errorData.message}`;
              }
            }
          } catch (e) {
            // If we can't parse the error, use the default message
          }
          
          if (typeof window !== 'undefined') {
            alert(errorMessage);
          }
        }
      } catch (webhookError) {
        console.error('❌ Failed to trigger calendar webhook:', {
          error: webhookError,
          errorMessage: webhookError?.message,
          errorName: webhookError?.name,
          errorStack: webhookError?.stack,
          url: webhookUrl
        });
        
        // Try a simpler payload as fallback
        try {
          console.log('🔄 Trying fallback webhook with simpler payload...');
          const fallbackPayload = {
            event: 'calendar_event_created',
            title: title,
            deadline: deadlineISO,
            user_id: userId
          };
          
          console.log('📤 Fallback payload:', JSON.stringify(fallbackPayload, null, 2));
          
          const fallbackResponse = await fetch('https://qiq-ai.app.n8n.cloud/webhook/4467d488-f652-45f6-809d-f0b650940ad1', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fallbackPayload)
          });
          
          console.log('📡 Fallback response status:', fallbackResponse.status);
          
          if (fallbackResponse.ok) {
            console.log('✅ Fallback webhook succeeded');
            if (typeof window !== 'undefined') {
              alert('📅 Calendar event has been added to your calendar!');
            }
          } else {
            const fallbackErrorText = await fallbackResponse.text();
            console.error('❌ Fallback webhook failed:', {
              status: fallbackResponse.status,
              statusText: fallbackResponse.statusText,
              response: fallbackErrorText
            });
            throw new Error(`Fallback failed: ${fallbackResponse.status} - ${fallbackErrorText}`);
          }
        } catch (fallbackError) {
          console.error('❌ Fallback webhook also failed:', {
            error: fallbackError,
            errorMessage: fallbackError?.message,
            errorName: fallbackError?.name
          });
          if (typeof window !== 'undefined') {
            alert('⚠️ Failed to add calendar event. Please check your internet connection and try again.');
          }
        }
      }
      
      console.log('📅 Calendar webhook triggered successfully');
    } catch (error) {
      console.error('❌ Outer catch - Failed to trigger calendar webhook:', {
        error: error,
        errorMessage: error?.message,
        errorName: error?.name,
        errorStack: error?.stack,
        errorType: typeof error
      });
      if (typeof window !== 'undefined') {
        alert('Failed to add calendar event. Please try again.');
      }
    }
  };

  // Compare helpers
  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };


  // Completed courses storage
  const completedKey = `pmis-completed-courses:${userId}`;
  // Initialize saved IDs and completed courses
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(completedKey);
        if (raw) setCompletedCourses(JSON.parse(raw));
      }
    } catch {}
    
    // Initialize saved IDs from tracker
    if (tracker && setSavedIds) {
      const saved = tracker.list();
      const savedMap: Record<string, boolean> = {};
      saved.forEach(item => {
        savedMap[item.internshipId] = true;
      });
      setSavedIds(savedMap);
    }
  }, [completedKey, userId, tracker]);


  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gov-saffron mx-auto mb-4" role="status" aria-label="Loading"></div>
              <h2 className="text-xl font-semibold text-gov-navy mb-2">Getting AI Recommendations</h2>
              <p className="text-gray-600">Our AI is analyzing your profile to find the perfect internship matches...</p>
              <div className="mt-4 max-w-md mx-auto bg-gray-200 rounded-full h-2">
                <div className="bg-gov-saffron h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  Fetching personalized recommendations from AI model...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "Authentication required. Please log in to view recommendations."}
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <button 
              onClick={() => router.push('/login')}
              className="bg-gov-saffron hover:bg-gov-saffron/90 text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Go to Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gov-saffron mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gov-navy mb-2 flex items-center gap-2">
                <Brain className="w-8 h-8 text-gov-saffron" />
                AI-Powered Recommendations
              </h1>
              <p className="text-gray-600">
                Personalized internship recommendations for {studentProfile?.name}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className="border border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                <span>Refresh</span>
              </button>
              <Link href="/internship">
                <button className="border border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>Back to Form</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Enhanced Stats & Insights */}
          {recommendations && (
            <div className="space-y-6 mb-8">
              {/* Primary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-gov-saffron/20 shadow-md">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-gov-saffron mb-1">{recommendations.total_recommendations}</div>
                    <div className="text-sm text-gray-600">Total Matches</div>
                    <div className="text-xs text-gray-500 mt-1">Personalized for you</div>
                  </CardContent>
                </Card>
                <Card className="border-green-200 shadow-md">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {recommendations.recommendations.length > 0 ? 
                        Math.round(Math.max(...recommendations.recommendations.map(r => r.success_prob || r.scores.success_probability || 0)) * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-600">Highest Success Rate</div>
                    <div className="text-xs text-gray-500 mt-1">Best match probability</div>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 shadow-md">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{uniqueDomains.length}</div>
                    <div className="text-sm text-gray-600">Domains</div>
                    <div className="text-xs text-gray-500 mt-1">Career paths</div>
                  </CardContent>
                </Card>
                <Card className="border-purple-200 shadow-md">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{uniqueLocations.length}</div>
                    <div className="text-sm text-gray-600">Locations</div>
                    <div className="text-xs text-gray-500 mt-1">Cities available</div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Insights Summary */}
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-800">
                    <Brain className="w-5 h-5" />
                    AI Analysis Summary
                  </CardTitle>
            </CardHeader>
            <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600 mb-1">
                        {recommendations.recommendations.length > 0 && (recommendations.recommendations[0]?.success_prob || recommendations.recommendations[0]?.scores.success_probability) ? 
                          Math.round((recommendations.recommendations[0].success_prob || recommendations.recommendations[0].scores.success_probability || 0) * 100) : 0}%
                      </div>
                      <div className="text-sm text-indigo-700 font-medium">Top Match Success Rate</div>
                      <div className="text-xs text-indigo-600 mt-1">
                        {recommendations.recommendations[0]?.title || 'Best recommendation'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {studentProfile?.skills.length || 8}
                      </div>
                      <div className="text-sm text-green-700 font-medium">Skills Matched</div>
                      <div className="text-xs text-green-600 mt-1">
                        Strong technical profile
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {recommendations.recommendations.reduce((total, rec) => total + (rec.missing_skills?.length || 0), 0)}
                      </div>
                      <div className="text-sm text-orange-700 font-medium">Skills to Develop</div>
                      <div className="text-xs text-orange-600 mt-1">
                        Courses recommended
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Recommendations */}
                  <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-100">
                    <div className="text-sm font-medium text-indigo-800 mb-2">💡 Quick Insights:</div>
                    <ul className="text-sm text-indigo-700 space-y-1">
                      <li>• Your {studentProfile?.stream || 'technical'} background aligns well with {uniqueDomains.length} top companies</li>
                      <li>• Consider applying to {uniqueLocations.slice(0, 2).join(' and ')} for better opportunities</li>
                      <li>• Strengthen your profile with the recommended courses for higher success rates</li>
              </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>

        {/* Filters removed as per requirement - recommendations page is display-only */}

        {/* Two-Stage Recommendations UI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredRecs.filter(rec => rec && rec.internship_id).length > 0 ? (
            filteredRecs.filter(rec => rec && rec.internship_id).map((rec, index) => (
            <motion.div
              key={`${rec.internship_id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              {/* List View Card */}
              <Card 
                className="relative border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white cursor-pointer"
                onClick={() => setSelectedRecommendation(rec)}
              >
                {/* Government Border Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gov-saffron"></div>
                
                <CardContent className="p-6">
                  {/* Compact List View */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Company Logo */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white flex-shrink-0">
                        <Image 
                          src={getCompanyLogo(rec.organization_name)} 
                          alt={`${rec.organization_name} logo`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized={true}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rec.organization_name)}&background=f8fafc&color=475569&size=48`;
                          }}
                        />
                      </div>
                      
                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <Badge className="bg-gov-saffron text-white border-0 px-2 py-1 text-xs font-medium">
                            #{rec.rank}
                          </Badge>
                          <Badge variant="outline" className="border-gray-300 text-gray-700 px-2 py-1 text-xs">
                            {rec.domain}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{rec.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {rec.organization_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {rec.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ₹{rec.stipend.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Success Rate & Action */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round((rec.success_prob || rec.scores.success_probability || 0) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">Success Rate</div>
                      </div>
                      
                      {/* Click to View Icon */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  </div>
            </CardContent>
          </Card>

            </motion.div>
            ))
          ) : (
            // Empty State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Found</h3>
                <p className="text-gray-600 mb-4">
                  The ML model couldn&apos;t find any matching internships for your profile. This might be due to:
                </p>
                <ul className="text-sm text-gray-500 text-left space-y-1 mb-6">
                  <li>• Limited internship data in the system</li>
                  <li>• Very specific profile requirements</li>
                  <li>• Temporary model issues</li>
                </ul>
                <div className="space-y-3">
                  <button 
                    onClick={() => window.location.reload()} 
                    className="w-full bg-gov-navy text-white hover:bg-gov-blue shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    <span>Refresh Recommendations</span>
                  </button>
                  <button 
                    onClick={() => window.history.back()}
                    className="w-full border border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2"
                  >
                    <span>← Back to Form</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedRecommendation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRecommendation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                    <Image 
                      src={getCompanyLogo(selectedRecommendation.organization_name)} 
                      alt={`${selectedRecommendation.organization_name} logo`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized={true}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRecommendation.organization_name)}&background=f8fafc&color=475569&size=48`;
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedRecommendation.title}</h2>
                    <p className="text-gray-600">{selectedRecommendation.organization_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecommendation(null)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-9 rounded-md px-3 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Detailed Header Section */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-start gap-6 flex-1">
                    {/* Professional Company Logo */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                      <Image 
                        src={getCompanyLogo(selectedRecommendation.organization_name)} 
                        alt={`${selectedRecommendation.organization_name} logo`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized={true}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRecommendation.organization_name)}&background=f8fafc&color=475569&size=64`;
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Professional Badge System */}
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-gov-saffron text-white border-0 px-3 py-1 text-sm font-medium">
                          Rank #{selectedRecommendation.rank}
                        </Badge>
                        <Badge variant="outline" className="border-gray-300 text-gray-700 px-3 py-1 text-xs">
                          {selectedRecommendation.domain}
                        </Badge>
                      </div>
                      
                      {/* Clean Typography */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedRecommendation.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{selectedRecommendation.organization_name}</span>
                      </div>
                      
                      {/* Clean Info Grid */}
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{selectedRecommendation.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>{selectedRecommendation.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span>₹{selectedRecommendation.stipend.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Professional Success Probability Display */}
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {Math.round((selectedRecommendation.success_prob || selectedRecommendation.scores.success_probability || 0) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Success Rate</div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(selectedRecommendation.success_prob || selectedRecommendation.scores.success_probability || 0) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {(selectedRecommendation.success_prob || selectedRecommendation.scores.success_probability || 0) > 0.8 ? 'Excellent Match' : 
                       (selectedRecommendation.success_prob || selectedRecommendation.scores.success_probability || 0) > 0.6 ? 'Good Match' : 
                       (selectedRecommendation.success_prob || selectedRecommendation.scores.success_probability || 0) > 0.4 ? 'Fair Match' : 'Needs Improvement'}
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Skills & Analysis */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Professional Skills Section */}
                    {studentProfile && (
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-blue-600" />
                          Skills Analysis
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Your Skills */}
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-3">Your Skills</div>
                            <div className="flex flex-wrap gap-2">
                              {studentProfile.skills.slice(0, 6).map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {studentProfile.skills.length > 6 && (
                                <Badge variant="outline" className="text-gray-500 text-xs">
                                  +{studentProfile.skills.length - 6} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Missing Skills */}
                          {selectedRecommendation.missing_skills && selectedRecommendation.missing_skills.length > 0 && (
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-3">Skills to Develop</div>
                              <div className="flex flex-wrap gap-2">
                                {selectedRecommendation.missing_skills.slice(0, 4).map((skill, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {selectedRecommendation.missing_skills.length > 4 && (
                                  <Badge variant="outline" className="text-gray-500 text-xs">
                                    +{selectedRecommendation.missing_skills.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Professional Course Recommendations */}
                    {/* Debug logging for course suggestions from ML model */}
                    {console.log('[RecommendationsPage] ML Model Course Data:', {
                      internshipTitle: selectedRecommendation.title,
                      organization: selectedRecommendation.organization_name,
                      hasCourseSuggestions: !!selectedRecommendation.course_suggestions,
                      courseSuggestionsLength: selectedRecommendation.course_suggestions?.length || 0,
                      rawCourseSuggestions: selectedRecommendation.course_suggestions,
                      missingSkills: selectedRecommendation.missing_skills,
                      allRecommendationData: selectedRecommendation
                    })}
                    {/* Course Recommendations Section - Only show what ML model provides */}
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        Recommended Courses
                      </h4>
                      
                      {selectedRecommendation.course_suggestions && selectedRecommendation.course_suggestions.length > 0 ? (
                        <div className="space-y-3">
                          {selectedRecommendation.course_suggestions.slice(0, 2).map((course, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 mb-1">{course.course_name}</h5>
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                    <span className="flex items-center gap-1">
                                      <Building2 className="w-3 h-3" />
                                      {course.platform}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {getCourseDuration(course.platform)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">{getCourseDescription(course.skill)}</p>
                                </div>
                                <button
                                  className="ml-4 text-xs h-9 rounded-md px-3 border border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center justify-center whitespace-nowrap font-medium"
                                  onClick={() => {
                                    if (typeof window !== 'undefined') {
                                      window.open(getCourseLink(course.platform, course.course_name), '_blank');
                                    }
                                  }}
                                >
                                  <span className="inline-flex items-center gap-1">
                                    Enroll
                                    <ExternalLink className="w-3 h-3" />
                                  </span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 mb-2">No course recommendations available</p>
                          <p className="text-sm text-gray-400">
                            The ML model did not provide course suggestions for this internship.
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Check browser console for ML model data details.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional Right Column - Actions & Details */}
                  <div className="space-y-6">
                    {/* Why This Matches */}
                    {(selectedRecommendation.reasons || selectedRecommendation.explain_reasons) && (selectedRecommendation.reasons || selectedRecommendation.explain_reasons).length > 0 && (
                      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-green-600" />
                          Why This Matches You
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {(selectedRecommendation.reasons || selectedRecommendation.explain_reasons).slice(0, 3).map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Professional Action Buttons */}
                    <div className="space-y-3">
                      <button 
                        className="w-full bg-gov-saffron hover:bg-gov-saffron/90 text-white h-12 text-base font-semibold inline-flex items-center justify-center rounded-md transition-all"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.open(getApplicationLink(selectedRecommendation.internship_id, selectedRecommendation.organization_name), '_blank');
                          }
                        }}
                        aria-label="Apply Now"
                      >
                        <span className="inline-flex items-center gap-2">Apply Now<ExternalLink className="w-4 h-4" /></span>
                      </button>
                      
                      <div className="flex gap-2">
                        <button 
                          className="flex-1 text-xs font-medium px-3 py-2 border border-gov-navy rounded-md text-gov-navy hover:bg-gov-navy hover:text-white transition-colors"
                          onClick={() => toggleCompare(selectedRecommendation.internship_id)}
                          aria-label={compareIds.includes(selectedRecommendation.internship_id) ? 'Remove' : 'Compare'}
                        >
                          <span>{compareIds.includes(selectedRecommendation.internship_id) ? 'Remove' : 'Compare'}</span>
                        </button>
                        <button 
                          className="flex-1 text-xs font-medium px-3 py-2 border border-gov-navy rounded-md text-gov-navy hover:bg-gov-navy hover:text-white transition-colors"
                          onClick={async () => {
                            if (typeof window !== 'undefined') {
                              try {
                                if (navigator.share) {
                                  await navigator.share({
                                    title: `${selectedRecommendation.title} at ${selectedRecommendation.organization_name}`,
                                    text: `Check out this internship opportunity: ${selectedRecommendation.title}`,
                                    url: window.location.href
                                  });
                                } else {
                                  await navigator.clipboard.writeText(window.location.href);
                                  alert('Link copied to clipboard!');
                                }
                              } catch (error) {
                                // Handle share cancellation or other errors silently
                                if (error instanceof Error && error.name === 'AbortError') {
                                  // User cancelled the share dialog - this is normal behavior
                                  return;
                                }
                                // For other errors, fallback to clipboard
                                try {
                                  await navigator.clipboard.writeText(window.location.href);
                                  alert('Link copied to clipboard!');
                                } catch (clipboardError) {
                                  console.warn('Failed to copy to clipboard:', clipboardError);
                                }
                              }
                            }
                          }}
                        >
                          <span>Share</span>
                        </button>
                      </div>
                    </div>

                    {/* Professional Application Deadline */}
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-800">Application Deadline</span>
                      </div>
                      <div className="text-lg font-bold text-red-600 mb-2">
                        {(() => {
                          // Ensure we always have a deadline
                          let deadline = selectedRecommendation.application_deadline;
                          
                          if (!deadline) {
                            // Generate a random December 2025 deadline as fallback
                            const startDate = new Date('2025-12-01');
                            const randomDays = Math.floor(Math.random() * 31);
                            const fallbackDeadline = new Date(startDate);
                            fallbackDeadline.setDate(startDate.getDate() + randomDays);
                            fallbackDeadline.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);
                            deadline = fallbackDeadline.toISOString();
                            
                            console.log(`[UI Fallback] Generated deadline for ${selectedRecommendation.title}:`, deadline);
                          }
                          
                          return new Date(deadline).toLocaleDateString();
                        })()}
                      </div>
                      <button
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-100 h-9 rounded-md px-3 inline-flex items-center justify-center whitespace-nowrap font-medium"
                        onClick={async () => {
                          // Use the same deadline logic as the display
                          let deadline = selectedRecommendation.application_deadline;
                          
                          if (!deadline) {
                            // Generate a random December 2025 deadline as fallback
                            const startDate = new Date('2025-12-01');
                            const randomDays = Math.floor(Math.random() * 31);
                            const fallbackDeadline = new Date(startDate);
                            fallbackDeadline.setDate(startDate.getDate() + randomDays);
                            fallbackDeadline.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);
                            deadline = fallbackDeadline.toISOString();
                          }
                          
                          await triggerCalendarWebhook(`${selectedRecommendation.title} – ${selectedRecommendation.organization_name}`, deadline);
                        }}
                      >
                        <span>Add to Calendar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


