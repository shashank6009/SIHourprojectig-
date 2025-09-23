// ML Service for Internship Recommendations
// Integrates with Railway ML API for AI-powered recommendations

import apiClient from '@/api/client';

// Types for ML API requests and responses (Updated to match Railway API)
export interface StudentProfile {
  student_id: string;
  skills: string[];
  stream: string;
  cgpa: number;
  rural_urban: string;
  college_tier: string;
  
  // Optional additional fields for our internal use
  name?: string;
  email?: string;
  phone?: string;
  university?: string;
  degree?: string;
  course?: string;
  graduation_year?: string;
  current_status?: string;
  work_experience?: string;
  languages?: string[];
  preferred_location?: string;
  preferred_duration?: string;
  preferred_domains?: string[];
  career_objective?: string;
  projects?: string;
  certifications?: string;
  achievements?: string;
  extracurriculars?: string;
}

export interface InternshipRecommendation {
  internship_id: string;
  title: string;
  organization_name: string;
  domain: string;
  location: string;
  duration: string;
  stipend: number;
  success_prob: number;
  missing_skills?: string[];
  courses?: Array<{
    name: string;
    url: string;
    platform: string;
  }>;
  reasons?: string[];
  // Application timeline fields
  application_deadline?: string; // ISO date string
  application_start_date?: string; // ISO date string
  interview_dates?: string[]; // Array of ISO date strings
  result_announcement?: string; // ISO date string
  internship_start_date?: string; // ISO date string
  // Computed fields for UI
  rank?: number;
  scores?: {
    success_probability: number;
  };
  explain_reasons?: string[];
  course_suggestions?: CourseSuggestion[];
}

export interface CourseSuggestion {
  skill: string;
  platform: string;
  course_name: string;
  link: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface MLRecommendationsResponse {
  student_id: string;
  total_recommendations: number;
  requested_count: number;
  recommendations: InternshipRecommendation[];
  processing_time?: number;
  model_version?: string;
}

export interface MLHealthResponse {
  service: string;
  version: string;
  description: string;
  status: string;
  endpoints?: {
    health: string;
    recommendations: string;
    docs: string;
  };
}

export class MLService {
  // Generate random application deadline around December 2025
  static generateRandomDeadline(): string {
    // Generate random date between December 1, 2025 and December 31, 2025
    const startDate = new Date('2025-12-01');
    
    // Random number of days to add (0 to 30)
    const randomDays = Math.floor(Math.random() * 31);
    
    // Create the deadline date
    const deadline = new Date(startDate);
    deadline.setDate(startDate.getDate() + randomDays);
    
    // Add some random time (9 AM to 5 PM)
    const randomHour = 9 + Math.floor(Math.random() * 8);
    const randomMinute = Math.floor(Math.random() * 60);
    deadline.setHours(randomHour, randomMinute, 0, 0);
    
    // Add a small random offset to ensure uniqueness
    const randomSeconds = Math.floor(Math.random() * 60);
    deadline.setSeconds(randomSeconds);
    
    return deadline.toISOString();
  }

  // Health check for ML API
  static async healthCheck(): Promise<MLHealthResponse> {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('[MLService] Health check failed:', error);
      throw new Error('ML API is currently unavailable');
    }
  }

  // Get recommendations from ML API
  static async getRecommendations(
    studentProfile: StudentProfile,
    topN: number = 10
  ): Promise<MLRecommendationsResponse> {
    // Offline-first: if offline, return cached or empty deterministic response
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator && !navigator.onLine) {
      const cached = this.getCachedRecommendations(studentProfile.student_id);
      if (cached) {
        return cached;
      }
      return {
        student_id: studentProfile.student_id,
        total_recommendations: 0,
        requested_count: 0,
        recommendations: [],
        processing_time: 0,
        model_version: 'offline'
      };
    }
    // Validate input parameters
    if (!studentProfile || !studentProfile.student_id) {
      throw new Error('Invalid student profile: missing student ID');
    }
    
    if (topN < 1 || topN > 50) {
      throw new Error('Invalid topN parameter: must be between 1 and 50');
    }
    
    try {
      console.log('[MLService] Requesting recommendations for:', studentProfile.student_id);
      console.log('[MLService] Request timestamp:', new Date().toISOString());
      
      // Send only the required fields to the ML API
      const apiPayload = {
        student_id: studentProfile.student_id,
        skills: Array.isArray(studentProfile.skills) ? studentProfile.skills : [],
        stream: studentProfile.stream || '',
        cgpa: typeof studentProfile.cgpa === 'number' ? studentProfile.cgpa : 0,
        rural_urban: studentProfile.rural_urban || '',
        college_tier: studentProfile.college_tier?.replace(' ', '-') || ''
      };
      
      console.log('[MLService] API Payload:', JSON.stringify(apiPayload, null, 2));
      
      // Validate required fields
      const requiredFields = ['student_id', 'skills', 'stream', 'cgpa', 'rural_urban', 'college_tier'];
      const missingFields = requiredFields.filter(field => 
        !apiPayload[field as keyof typeof apiPayload] || 
        (Array.isArray(apiPayload[field as keyof typeof apiPayload]) && 
         (apiPayload[field as keyof typeof apiPayload] as unknown[]).length === 0)
      );
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      const response = await apiClient.post('/recommendations', apiPayload);
      
      // Debug: Log the raw API response
      console.log('[MLService] Raw API Response:', JSON.stringify(response.data, null, 2));
      
      // Debug: Log success probabilities
      if (response.data.recommendations) {
        console.log('[MLService] Success Probabilities:', 
          response.data.recommendations.map((rec, index) => ({
            index: index + 1,
            title: rec.title,
            success_prob: rec.success_prob
          }))
        );
        
      // Debug: Log recommendation data and determinism
      console.log('[MLService] Raw API Response:', {
        total_recommendations: response.data.total_recommendations,
        first_5_recs: response.data.recommendations.slice(0, 5).map((rec, index) => ({
          index: index + 1,
          title: rec.title,
          organization: rec.organization_name,
          success_prob: rec.success_prob,
          internship_id: rec.internship_id
        }))
      });
      
      // Debug: Log course data
      console.log('[MLService] Course Data:', 
        response.data.recommendations.map((rec, index) => ({
          index: index + 1,
          title: rec.title,
          courses: rec.courses,
          missing_skills: rec.missing_skills,
          success_prob: rec.success_prob
        }))
      );
      }

      // Process and clean the response
      const rawRecommendations = response.data.recommendations || [];
      
      // Sort by success probability (highest first) for consistent ranking
      const sortedRecommendations = rawRecommendations.sort((a, b) => {
        const probA = a.success_prob || 0;
        const probB = b.success_prob || 0;
        return probB - probA; // Descending order (highest first)
      });
      
      // ⚠️ ML MODEL ISSUE: Add deterministic sorting for consistency
      // Since the ML model returns random recommendations, we need to ensure
      // consistent ordering by adding secondary sort criteria
      const deterministicSorted = sortedRecommendations.sort((a, b) => {
        const probA = a.success_prob || 0;
        const probB = b.success_prob || 0;
        
        // Primary sort: success probability
        if (probA !== probB) {
          return probB - probA;
        }
        
        // Secondary sort: internship_id for deterministic ordering
        return (a.internship_id || '').localeCompare(b.internship_id || '');
      });
      
      // Assign ranks based on sorted order (highest success probability gets rank 1)
      const recommendations = deterministicSorted.map((rec: Record<string, unknown>, index: number) => {
        const processedRec = {
          // Core recommendation fields (exact API field names)
          internship_id: rec.internship_id || '',
          title: rec.title || '',
          organization_name: rec.organization_name || '',
          domain: rec.domain || '',
          location: rec.location || '',
          duration: rec.duration || '',
          stipend: rec.stipend || 0,
          
          // Success metrics (use success_prob as primary)
          success_prob: rec.success_prob || 0,
          projected_success_prob: rec.projected_success_prob || rec.success_prob || 0,
          
          // Application stats
          applicants_total: rec.applicants_total || null,
          positions_available: rec.positions_available || null,
          selection_ratio: rec.selection_ratio || null,
          demand_pressure: rec.demand_pressure || null,
          
          // Skill development
          missing_skills: rec.missing_skills || [],
          course_suggestions: rec.course_suggestions || [],
          reasons: rec.reasons || [],
          
          // Application timeline - assign random December 2025 deadline
          application_deadline: (() => {
            const deadline = this.generateRandomDeadline();
            console.log(`[MLService] Generated deadline for ${rec.title}:`, deadline);
            return deadline;
          })(),
          
          // Enhanced fields (if available)
          success_breakdown: rec.success_breakdown || null,
          interview_meta: rec.interview_meta || null,
          live_counts: rec.live_counts || null,
          alumni_stories: rec.alumni_stories || [],
          
          // Frontend-specific fields
          rank: index + 1, // Rank 1 for highest success probability
          scores: {
            success_probability: rec.success_prob || 0,
          },
          explain_reasons: rec.reasons || [],
          
          // Legacy compatibility fields
          ...rec
        };
        
        // Debug: Log processed recommendation
        console.log(`[MLService] Processed Rec ${index + 1}:`, {
          title: processedRec.title,
          organization: processedRec.organization_name,
          success_prob: processedRec.success_prob,
          missing_skills: processedRec.missing_skills?.length || 0,
          course_suggestions: processedRec.course_suggestions?.length || 0,
          reasons: processedRec.reasons?.length || 0,
          course_suggestions_details: processedRec.course_suggestions
        });
        
        return processedRec;
      });

      return {
        student_id: response.data.student_id,
        total_recommendations: response.data.total_recommendations || recommendations.length,
        requested_count: recommendations.length,
        recommendations,
        processing_time: 0,
        model_version: '1.0'
      };
    } catch (error: Record<string, unknown>) {
      console.error('[MLService] Failed to get recommendations:', error);
      
      // Log the actual payload that was sent
      const apiPayload = {
        student_id: studentProfile.student_id,
        skills: Array.isArray(studentProfile.skills) ? studentProfile.skills : [],
        stream: studentProfile.stream || '',
        cgpa: typeof studentProfile.cgpa === 'number' ? studentProfile.cgpa : 0,
        rural_urban: studentProfile.rural_urban || '',
        college_tier: studentProfile.college_tier || ''
      };
      console.error('[MLService] Payload that caused error:', JSON.stringify(apiPayload, null, 2));
      
      // Provide specific error messages based on the error type
      // @ts-expect-error code may be attached dynamically
      if (error?.code === 'OFFLINE') {
        const cached = this.getCachedRecommendations(studentProfile.student_id);
        if (cached) return cached;
        return {
          student_id: studentProfile.student_id,
          total_recommendations: 0,
          requested_count: 0,
          recommendations: [],
          processing_time: 0,
          model_version: 'offline'
        };
      } else if (error?.response?.status === 422) {
        const errorMessage = error?.response?.data?.error || 'Invalid data provided to ML service';
        throw new Error(`Data validation failed: ${errorMessage}`);
      } else if (error?.response?.status === 500) {
        throw new Error('ML service is temporarily unavailable. Please try again later.');
      } else if (error?.response?.status === 404) {
        throw new Error('ML service endpoint not found. Please contact support.');
      } else if (error?.code === 'NETWORK_ERROR' || !error?.response) {
        throw new Error('Network error: Unable to connect to ML service. Please check your internet connection.');
      } else if (error instanceof Error) {
        throw new Error(`ML API Error: ${error.message}`);
      } else {
        throw new Error('Failed to get AI recommendations. Please try again.');
      }
    }
  }


  // Transform intern form data to ML API format
  static transformInternFormToProfile(formData: Record<string, unknown>, userId: string): StudentProfile {
    // Extract skills from various form fields with better fallbacks
    const skillSources = [
      formData.technicalSkills || formData.skills || '',
      formData.softSkills || '',
      formData.languages || '',
      formData.certifications || '',
      // Add some default skills if none provided
      formData.course || formData.degree || ''
    ];
    
    let allSkills = skillSources
      .flatMap(source => this.parseSkills(source))
      .filter(skill => skill.length > 0);
    
    // If no skills provided, add some basic defaults based on stream
    if (allSkills.length === 0) {
      allSkills = ['Communication', 'Problem Solving', 'Teamwork'];
    }

    // Determine stream from course/degree with better fallback
    const courseInfo = formData.course || formData.degree || formData.educationDetails?.course || formData.educationDetails?.degree || '';
    let stream = this.determineStream(courseInfo);
    // Default to Computer Science if can't determine
    if (!stream) stream = 'Computer Science';

    // Convert CGPA to number with validation
    let cgpaString = formData.cgpa || '';
    if (!cgpaString && typeof formData.educationDetails === 'string') {
      cgpaString = this.extractCgpaFromText(formData.educationDetails);
    }
    if (!cgpaString && typeof formData.education === 'string') {
      cgpaString = this.extractCgpaFromText(formData.education);
    }
    let cgpaValue = this.parseCgpaToTenScale(cgpaString);
    // As a last resort, read from wizard storage if present
    if ((cgpaValue === 0 || isNaN(cgpaValue)) && typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('pmis-internship-wizard');
        if (raw) {
          const wiz = JSON.parse(raw);
          if (wiz?.cgpa) {
            cgpaValue = this.parseCgpaToTenScale(String(wiz.cgpa));
          }
        }
      } catch {}
    }
    // Default to 7.5 if can't determine
    if (cgpaValue === 0 || isNaN(cgpaValue)) cgpaValue = 7.5;

    // Determine rural/urban based on location preference or university
    const locationInfo = formData.preferredLocation || formData.university || formData.city || '';
    let ruralUrban = this.determineRuralUrban(locationInfo);
    // Default to Urban if can't determine
    if (!ruralUrban) ruralUrban = 'Urban';

    // Determine college tier (simplified logic)
    const universityInfo = formData.university || formData.educationDetails?.university || formData.college || '';
    let collegeTier = this.determineCollegeTier(universityInfo);
    // Default to Tier-2 if can't determine
    if (!collegeTier) collegeTier = 'Tier-2';

    const profile = {
      // Required ML API fields
      student_id: userId,
      skills: allSkills.slice(0, 10), // Limit to top 10 skills (may be empty → validation will catch)
      stream: stream,
      cgpa: cgpaValue,
      rural_urban: ruralUrban,
      college_tier: collegeTier,
      
      // Optional fields for our internal use
      name: formData.name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
      email: formData.email || '',
      phone: formData.phone,
      university: formData.university || formData.educationDetails?.university || '',
      degree: formData.degree || formData.educationDetails?.degree || '',
      course: formData.course || formData.educationDetails?.course || '',
      graduation_year: formData.graduationYear || formData.educationDetails?.graduationYear || '',
      current_status: formData.currentStatus || 'Student',
      work_experience: formData.experience || formData.workExperience || '0-1 years',
      languages: this.parseSkills(formData.languages),
      preferred_location: formData.preferredLocation || '',
      preferred_duration: formData.preferredDuration || formData.duration,
      preferred_domains: this.parseSkills(formData.preferredDomain || formData.domains),
      career_objective: formData.careerObjective || formData.objective || '',
      projects: formData.projects,
      certifications: formData.certifications,
      achievements: formData.achievements,
      extracurriculars: formData.extracurriculars || formData.activities
    };

    // Debug logging - show all form data keys for debugging
    console.log('[MLService] All Form Data Keys:', Object.keys(formData));
    console.log('[MLService] Transform Debug:', {
      originalFormData: {
        course: formData.course,
        degree: formData.degree,
        cgpa: formData.cgpa,
        university: formData.university,
        skills: formData.skills,
        technicalSkills: formData.technicalSkills,
        softSkills: formData.softSkills,
        languages: formData.languages,
        preferredLocation: formData.preferredLocation,
        name: formData.name,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      },
      transformedProfile: {
        student_id: profile.student_id,
        skills: profile.skills,
        stream: profile.stream,
        cgpa: profile.cgpa,
        rural_urban: profile.rural_urban,
        college_tier: profile.college_tier
      }
    });

    return profile;
  }

  // Parse comma-separated skills into array
  private static parseSkills(skillsString?: string): string[] {
    if (!skillsString) return [];
    return String(skillsString)
      .split(/[\n,;•·\u2022\-]+/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }

  // Parse CGPA strings like "8.5/10", "85%", "8.5" to a 0-10 scale number
  private static parseCgpaToTenScale(raw: string): number {
    if (!raw) return 0;
    const value = String(raw).trim();
    // Percentage like 85%
    const percMatch = value.match(/^(\d+(?:\.\d+)?)\s*%$/);
    if (percMatch) {
      const n = parseFloat(percMatch[1]);
      if (isNaN(n)) return 0;
      return Math.min(10, Math.max(0, n / 10));
    }
    // Slash formats like 8.5/10 or 3.8/4
    const slashMatch = value.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
    if (slashMatch) {
      const num = parseFloat(slashMatch[1]);
      const denom = parseFloat(slashMatch[2]);
      if (isNaN(num) || isNaN(denom) || denom === 0) return 0;
      const tenScale = (num / denom) * 10;
      return Math.min(10, Math.max(0, tenScale));
    }
    // Plain number (assume already on 10 scale)
    const n = parseFloat(value);
    if (isNaN(n)) return 0;
    return Math.min(10, Math.max(0, n));
  }

  // Extract cgpa-like value from arbitrary education text
  private static extractCgpaFromText(text: string): string {
    if (!text) return '';
    const t = String(text);
    const match = t.match(/(?:cgpa|gpa|percentage|marks)[^\d]*(\d+(?:\.\d+)?)(?:\s*\/\s*(\d+))?|((\d+(?:\.\d+)?)\s*%)/i);
    if (match) {
      if (match[3]) return match[3]; // percentage like 85%
      if (match[1] && match[2]) return `${match[1]}/${match[2]}`; // 8.5/10
      if (match[1]) return match[1]; // plain number
    }
    return '';
  }

  // Convert string numbers to actual numbers
  private static convertToNumber(value: Record<string, unknown>): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  // Determine stream from course/degree
  private static determineStream(courseOrDegree: string): string {
    if (!courseOrDegree) return '';
    const course = courseOrDegree.toLowerCase();
    
    if (course.includes('computer') || course.includes('software') || course.includes('it') || course.includes('information technology')) {
      return 'Computer Science';
    } else if (course.includes('mechanical') || course.includes('mech')) {
      return 'Mechanical Engineering';
    } else if (course.includes('electrical') || course.includes('electronics') || course.includes('ece') || course.includes('eee')) {
      return 'Electrical Engineering';
    } else if (course.includes('civil')) {
      return 'Civil Engineering';
    } else if (course.includes('chemical')) {
      return 'Chemical Engineering';
    } else if (course.includes('biotechnology') || course.includes('biotech')) {
      return 'Biotechnology';
    } else if (course.includes('management') || course.includes('mba') || course.includes('business')) {
      return 'Management';
    } else if (course.includes('commerce') || course.includes('bcom') || course.includes('finance')) {
      return 'Commerce';
    } else if (course.includes('arts') || course.includes('ba') || course.includes('literature')) {
      return 'Arts';
    } else if (course.includes('science') || course.includes('bsc') || course.includes('physics') || course.includes('chemistry') || course.includes('mathematics')) {
      return 'Science';
    } else {
      return '';
    }
  }

  // Determine rural/urban classification
  private static determineRuralUrban(location: string): string {
    if (!location) return '';
    const loc = location.toLowerCase();
    
    // Major urban centers
    const urbanKeywords = [
      'mumbai', 'delhi', 'bangalore', 'hyderabad', 'pune', 'chennai', 'kolkata', 
      'ahmedabad', 'surat', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore',
      'bhopal', 'visakhapatnam', 'patna', 'vadodara', 'ghaziabad', 'ludhiana',
      'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'kalyan', 'vasai',
      'varanasi', 'srinagar', 'aurangabad', 'dhanbad', 'amritsar', 'navi mumbai',
      'allahabad', 'ranchi', 'howrah', 'coimbatore', 'jabalpur', 'gwalior',
      'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 'guwahati',
      'chandigarh', 'solapur', 'hubli', 'tiruchirappalli', 'bareilly', 'mysore',
      'tiruppur', 'gurgaon', 'aligarh', 'jalandhar', 'bhubaneswar', 'salem',
      'mira', 'bhiwandi', 'saharanpur', 'gorakhpur', 'bikaner', 'amravati',
      'noida', 'jamshedpur', 'bhilai', 'cuttack', 'firozabad', 'kochi',
      'nellore', 'bhavnagar', 'dehradun', 'durgapur', 'asansol', 'rourkela',
      'nanded', 'kolhapur', 'ajmer', 'akola', 'gulbarga', 'jamnagar',
      'ujjain', 'loni', 'siliguri', 'jhansi', 'ulhasnagar', 'nellore',
      'jammu', 'sangli miraj kupwad', 'mangalore', 'erode', 'belgaum',
      'ambattur', 'tirunelveli', 'malegaon', 'gaya', 'jalgaon', 'udaipur',
      'maheshtala', 'davanagere', 'kozhikode', 'kurnool', 'rajpur sonarpur',
      'rajahmundry', 'bokaro', 'south dumdum', 'bellary', 'patiala', 'gopalpur',
      'agartala', 'bhagalpur', 'muzaffarnagar', 'bhatpara', 'panihati',
      'latur', 'dhule', 'rohtak', 'korba', 'bhilwara', 'berhampur',
      'muzaffarpur', 'ahmednagar', 'mathura', 'kollam', 'avadi', 'kadapa',
      'kamarhati', 'sambalpur', 'bilaspur', 'shahjahanpur', 'satara',
      'bijapur', 'rampur', 'shivamogga', 'chandrapur', 'junagadh',
      'thrissur', 'alwar', 'bardhaman', 'kulti', 'kakinada', 'nizamabad',
      'parbhani', 'tumkur', 'khammam', 'ozhukarai', 'bihar sharif',
      'panipat', 'darbhanga', 'bally', 'aizawl', 'dewas', 'ichalkaranji'
    ];
    
    const isUrban = urbanKeywords.some(keyword => loc.includes(keyword)) || 
                   loc.includes('city') || 
                   loc.includes('metro') || 
                   loc.includes('urban');
    
    return isUrban ? 'Urban' : 'Rural';
  }

  // Determine college tier (simplified classification)
  private static determineCollegeTier(university: string): string {
    if (!university) return '';
    const uni = university.toLowerCase();
    
    // Tier 1 institutions
    const tier1Keywords = [
      'iit', 'iiit', 'iim', 'iisc', 'nit', 'bits', 'vit', 'manipal', 'srm',
      'amity', 'lovely professional', 'thapar', 'delhi technological',
      'indian institute', 'national institute', 'birla institute',
      'international institute', 'anna university', 'jadavpur university',
      'university of delhi', 'jawaharlal nehru university', 'banaras hindu university',
      'aligarh muslim university', 'jamia millia islamia', 'indian statistical institute'
    ];
    
    // Tier 2 institutions
    const tier2Keywords = [
      'state university', 'central university', 'deemed university',
      'engineering college', 'technology institute', 'technical university',
      'government college', 'autonomous college'
    ];
    
    if (tier1Keywords.some(keyword => uni.includes(keyword))) {
      return 'Tier-1';
    } else if (tier2Keywords.some(keyword => uni.includes(keyword))) {
      return 'Tier-2';
    } else {
      return 'Tier-3'; // Default to Tier 3
    }
  }

  // Store recommendations for offline access
  static async storeRecommendations(
    studentId: string, 
    recommendations: MLRecommendationsResponse
  ): Promise<void> {
    try {
      const storageKey = `ml_recommendations_${studentId}`;
      const dataToStore = {
        ...recommendations,
        timestamp: Date.now(),
        cached: true
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(dataToStore));
        console.log('[MLService] Recommendations cached for offline access');
      }
    } catch (error) {
      console.error('[MLService] Failed to cache recommendations:', error);
    }
  }

  // Get cached recommendations
  static getCachedRecommendations(studentId: string): MLRecommendationsResponse | null {
    try {
      if (typeof window === 'undefined') return null;
      
      const storageKey = `ml_recommendations_${studentId}`;
      const cached = localStorage.getItem(storageKey);
      
      if (cached) {
        const data = JSON.parse(cached);
        // Return cached data if less than 1 hour old
        if (Date.now() - data.timestamp < 60 * 60 * 1000) {
          return data;
        }
      }
    } catch (error) {
      console.error('[MLService] Failed to get cached recommendations:', error);
    }
    
    return null;
  }

  // Clear cached recommendations
  static clearCachedRecommendations(studentId: string): void {
    try {
      if (typeof window !== 'undefined') {
        const storageKey = `ml_recommendations_${studentId}`;
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('[MLService] Failed to clear cached recommendations:', error);
    }
  }

  // Get success probability for specific internship
  static async getSuccessProbability(
    studentProfile: StudentProfile,
    internshipId: string
  ): Promise<number> {
    try {
      const response = await apiClient.post('/success-probability', {
        student_profile: studentProfile,
        internship_id: internshipId
      });
      
      return this.convertToNumber(response.data.success_probability);
    } catch (error) {
      console.error('[MLService] Failed to get success probability:', error);
      return 0;
    }
  }
}


