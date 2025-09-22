// User Analytics and Application Tracking System

export interface InternshipApplication {
  id: string;
  companyName: string;
  position: string;
  sector: string;
  appliedDate: string;
  status: 'pending' | 'under_review' | 'interview_scheduled' | 'accepted' | 'rejected' | 'withdrawn';
  interviewDate?: string;
  offerDetails?: {
    stipend: number;
    duration: string;
    startDate: string;
    location: string;
  };
  rejectionReason?: string;
  lastUpdated: string;
}

export interface UserSkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements: number;
  lastAssessed: string;
  improvementSuggestions?: string[];
}

export interface UserNotification {
  id: string;
  type: 'application_update' | 'interview_reminder' | 'profile_suggestion' | 'new_opportunity' | 'document_expiry';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface UserDocument {
  id: string;
  name: string;
  type: 'resume' | 'certificate' | 'transcript' | 'id_proof' | 'other';
  fileUrl: string;
  uploadedDate: string;
  expiryDate?: string;
  verified: boolean;
  size: string;
}

export interface UserAnalytics {
  applications: InternshipApplication[];
  skills: UserSkill[];
  notifications: UserNotification[];
  documents: UserDocument[];
  profileCompleteness: number;
  successRate: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  interviewsScheduled: number;
  lastActivityDate: string;
}

// Analytics Storage Class
export class UserAnalyticsStorage {
  private static STORAGE_KEY = 'pmis_user_analytics';

  // Generate mock data for demonstration
  static generateMockAnalytics(userId: string): UserAnalytics {
    const mockApplications: InternshipApplication[] = [
      {
        id: '1',
        companyName: 'Tata Consultancy Services',
        position: 'Software Development Intern',
        sector: 'Information Technology',
        appliedDate: '2024-01-15',
        status: 'accepted',
        interviewDate: '2024-01-25',
        offerDetails: {
          stipend: 15000,
          duration: '6 months',
          startDate: '2024-02-01',
          location: 'Bangalore'
        },
        lastUpdated: '2024-01-30'
      },
      {
        id: '2',
        companyName: 'Infosys',
        position: 'Data Analytics Intern',
        sector: 'Information Technology',
        appliedDate: '2024-01-20',
        status: 'interview_scheduled',
        interviewDate: '2024-02-05',
        lastUpdated: '2024-02-01'
      },
      {
        id: '3',
        companyName: 'ISRO',
        position: 'Research Intern',
        sector: 'Government',
        appliedDate: '2024-01-10',
        status: 'rejected',
        rejectionReason: 'Position filled',
        lastUpdated: '2024-01-28'
      },
      {
        id: '4',
        companyName: 'Wipro',
        position: 'UI/UX Design Intern',
        sector: 'Information Technology',
        appliedDate: '2024-02-01',
        status: 'under_review',
        lastUpdated: '2024-02-03'
      },
      {
        id: '5',
        companyName: 'BHEL',
        position: 'Mechanical Engineering Intern',
        sector: 'Manufacturing',
        appliedDate: '2024-01-25',
        status: 'pending',
        lastUpdated: '2024-01-25'
      }
    ];

    const mockSkills: UserSkill[] = [
      {
        name: 'JavaScript',
        level: 'advanced',
        endorsements: 12,
        lastAssessed: '2024-01-15',
        improvementSuggestions: ['Learn TypeScript', 'Master async/await patterns']
      },
      {
        name: 'React',
        level: 'intermediate',
        endorsements: 8,
        lastAssessed: '2024-01-10',
        improvementSuggestions: ['Learn React hooks', 'Build more complex projects']
      },
      {
        name: 'Python',
        level: 'advanced',
        endorsements: 15,
        lastAssessed: '2024-01-20',
        improvementSuggestions: ['Learn Django framework', 'Practice data structures']
      },
      {
        name: 'Communication',
        level: 'intermediate',
        endorsements: 6,
        lastAssessed: '2024-01-05',
        improvementSuggestions: ['Join public speaking club', 'Practice presentations']
      }
    ];

    const mockNotifications: UserNotification[] = [
      {
        id: '1',
        type: 'interview_reminder',
        title: 'Interview Reminder',
        message: 'Your interview with Infosys is scheduled for tomorrow at 2:00 PM',
        priority: 'high',
        read: false,
        createdAt: '2024-02-04',
        actionUrl: '/dashboard/applications'
      },
      {
        id: '2',
        type: 'application_update',
        title: 'Application Status Update',
        message: 'Your application to TCS has been accepted! Congratulations!',
        priority: 'high',
        read: false,
        createdAt: '2024-01-30',
        actionUrl: '/dashboard/applications'
      },
      {
        id: '3',
        type: 'profile_suggestion',
        title: 'Profile Improvement',
        message: 'Add your project portfolio to increase profile strength by 15%',
        priority: 'medium',
        read: true,
        createdAt: '2024-01-28',
        actionUrl: '/dashboard/profile'
      },
      {
        id: '4',
        type: 'new_opportunity',
        title: 'New Matching Opportunity',
        message: '3 new internships match your skills and preferences',
        priority: 'medium',
        read: false,
        createdAt: '2024-02-02',
        actionUrl: '/internship'
      }
    ];

    const mockDocuments: UserDocument[] = [
      {
        id: '1',
        name: 'Resume_2024.pdf',
        type: 'resume',
        fileUrl: '/documents/resume.pdf',
        uploadedDate: '2024-01-15',
        verified: true,
        size: '245 KB'
      },
      {
        id: '2',
        name: 'Degree_Certificate.pdf',
        type: 'certificate',
        fileUrl: '/documents/degree.pdf',
        uploadedDate: '2024-01-10',
        verified: true,
        size: '1.2 MB'
      },
      {
        id: '3',
        name: 'Aadhaar_Card.pdf',
        type: 'id_proof',
        fileUrl: '/documents/aadhaar.pdf',
        uploadedDate: '2024-01-08',
        expiryDate: '2034-01-08',
        verified: true,
        size: '156 KB'
      }
    ];

    const totalApplications = mockApplications.length;
    const acceptedApplications = mockApplications.filter(app => app.status === 'accepted').length;
    const successRate = totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0;

    return {
      applications: mockApplications,
      skills: mockSkills,
      notifications: mockNotifications,
      documents: mockDocuments,
      profileCompleteness: 85,
      successRate: Math.round(successRate * 10) / 10,
      totalApplications,
      pendingApplications: mockApplications.filter(app => ['pending', 'under_review'].includes(app.status)).length,
      acceptedApplications,
      rejectedApplications: mockApplications.filter(app => app.status === 'rejected').length,
      interviewsScheduled: mockApplications.filter(app => app.status === 'interview_scheduled').length,
      lastActivityDate: '2024-02-04'
    };
  }

  // Save analytics data
  static saveAnalytics(userId: string, analytics: UserAnalytics): void {
    try {
      const key = `${this.STORAGE_KEY}_${userId}`;
      localStorage.setItem(key, JSON.stringify(analytics));
      console.log('User analytics saved successfully');
    } catch (error) {
      console.error('Error saving user analytics:', error);
    }
  }

  // Load analytics data
  static loadAnalytics(userId: string): UserAnalytics {
    try {
      const key = `${this.STORAGE_KEY}_${userId}`;
      const savedData = localStorage.getItem(key);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error loading user analytics:', error);
    }
    
    // Return mock data if no saved data exists
    return this.generateMockAnalytics(userId);
  }

  // Update application status
  static updateApplicationStatus(userId: string, applicationId: string, status: InternshipApplication['status'], additionalData?: Partial<InternshipApplication>): void {
    const analytics = this.loadAnalytics(userId);
    const applicationIndex = analytics.applications.findIndex(app => app.id === applicationId);
    
    if (applicationIndex !== -1) {
      analytics.applications[applicationIndex] = {
        ...analytics.applications[applicationIndex],
        status,
        ...additionalData,
        lastUpdated: new Date().toISOString()
      };
      
      // Recalculate success rate
      const totalApps = analytics.applications.length;
      const acceptedApps = analytics.applications.filter(app => app.status === 'accepted').length;
      analytics.successRate = totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100 * 10) / 10 : 0;
      
      this.saveAnalytics(userId, analytics);
    }
  }

  // Add new application
  static addApplication(userId: string, application: Omit<InternshipApplication, 'id' | 'lastUpdated'>): void {
    const analytics = this.loadAnalytics(userId);
    const newApplication: InternshipApplication = {
      ...application,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString()
    };
    
    analytics.applications.unshift(newApplication);
    analytics.totalApplications = analytics.applications.length;
    analytics.pendingApplications = analytics.applications.filter(app => ['pending', 'under_review'].includes(app.status)).length;
    
    this.saveAnalytics(userId, analytics);
  }

  // Mark notification as read
  static markNotificationRead(userId: string, notificationId: string): void {
    const analytics = this.loadAnalytics(userId);
    const notification = analytics.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveAnalytics(userId, analytics);
    }
  }

  // Calculate profile completeness
  static calculateProfileCompleteness(profileData: any): number {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'address',
      'skills', 'workExperience', 'education', 'careerObjective'
    ];
    
    const optionalFields = [
      'profileImage', 'dateOfBirth', 'gender', 'nationality',
      'city', 'state', 'pincode', 'university', 'course'
    ];
    
    let completedRequired = 0;
    let completedOptional = 0;
    
    requiredFields.forEach(field => {
      if (profileData[field] && profileData[field].trim() !== '') {
        completedRequired++;
      }
    });
    
    optionalFields.forEach(field => {
      if (profileData[field] && profileData[field].trim() !== '') {
        completedOptional++;
      }
    });
    
    // Required fields are worth 70%, optional fields 30%
    const requiredScore = (completedRequired / requiredFields.length) * 70;
    const optionalScore = (completedOptional / optionalFields.length) * 30;
    
    return Math.round(requiredScore + optionalScore);
  }
}
