'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProfileStorage, ProfileData } from '@/lib/profile';
import { UserAnalyticsStorage, UserAnalytics } from '@/lib/userAnalytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Award,
  Save,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Edit,
  Camera,
  BarChart3,
  TrendingUp,
  Bell,
  FileText,
  Target,
  Calendar,
  Clock,
  Star,
  Download,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  skills: string;
  workExperience: string;
  education: string;
  careerObjective: string;
  profileImage?: string;
}

function UserDashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    skills: '',
    workExperience: '',
    education: '',
    careerObjective: '',
    profileImage: ''
  });

  // Load profile and analytics data on component mount
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    const userId = session?.user?.email || 'demo@pmis.gov.in';
    
    // Load profile data
    const loadProfileData = () => {
      try {
        const savedProfile = ProfileStorage.getProfileForUser(userId);
        
        if (savedProfile) {
          const formData = {
            firstName: savedProfile.firstName || '',
            lastName: savedProfile.lastName || '',
            email: savedProfile.email || '',
            phone: savedProfile.phone || '',
            address: savedProfile.address || '',
            skills: savedProfile.skills || '',
            workExperience: savedProfile.workExperience || '',
            education: `${savedProfile.course || ''} - ${savedProfile.university || ''}`.trim(),
            careerObjective: savedProfile.careerObjective || '',
            profileImage: savedProfile.profileImage || ''
          };
          setProfileData(formData);
        } else {
          const user = session.user;
          const fullName = user?.name || '';
          const nameParts = fullName.split(' ').filter(part => part.trim().length > 0);
          
          let firstName = '';
          let lastName = '';
          
          if (nameParts.length === 0) {
            firstName = user?.email?.split('@')[0] || 'User';
            lastName = '';
          } else if (nameParts.length === 1) {
            firstName = nameParts[0];
            lastName = '';
          } else {
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(' ');
          }
          
          const initialData = {
            firstName: firstName,
            lastName: lastName,
            email: user?.email || '',
            phone: '',
            address: '',
            skills: '',
            workExperience: '',
            education: '',
            careerObjective: '',
            profileImage: user?.image || ''
          };
          setProfileData(initialData);
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
        setError('Failed to load profile data');
      }
    };

    // Load analytics data
    const loadAnalyticsData = () => {
      try {
        const userAnalytics = UserAnalyticsStorage.loadAnalytics(userId);
        setAnalytics(userAnalytics);
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      }
    };

    loadProfileData();
    loadAnalyticsData();
  }, [session, status, router]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const missingFields = [];
      if (!profileData.firstName?.trim()) missingFields.push('First Name');
      if (!profileData.email?.trim()) missingFields.push('Email Address');

      if (missingFields.length > 0) {
        throw new Error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const userId = session?.user?.email || 'demo@pmis.gov.in';
      const profileToSave: ProfileData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        skills: profileData.skills,
        workExperience: profileData.workExperience,
        careerObjective: profileData.careerObjective,
        profileImage: profileData.profileImage,
        dateOfBirth: '',
        gender: '',
        nationality: '',
        city: '',
        state: '',
        pincode: '',
        highestQualification: '',
        university: '',
        course: '',
        graduationYear: '',
        cgpa: '',
        currentStatus: '',
        languages: '',
        aadhaarNumber: '',
        bankAccountNumber: '',
        ifscCode: '',
        panNumber: '',
        category: '',
        preferredInternshipDuration: '',
        preferredLocation: '',
        lastUpdated: new Date().toISOString(),
        userId: userId
      };
      
      ProfileStorage.saveProfile(profileToSave);
      
      // Update analytics with new profile completeness
      if (analytics) {
        const completeness = UserAnalyticsStorage.calculateProfileCompleteness(profileToSave);
        const updatedAnalytics = { ...analytics, profileCompleteness: completeness };
        setAnalytics(updatedAnalytics);
        UserAnalyticsStorage.saveAnalytics(userId, updatedAnalytics);
      }
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Failed to save profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const markNotificationRead = (notificationId: string) => {
    if (analytics && session?.user?.email) {
      UserAnalyticsStorage.markNotificationRead(session.user.email, notificationId);
      setAnalytics(UserAnalyticsStorage.loadAnalytics(session.user.email));
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gov-saffron mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to view your dashboard.
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const unreadNotifications = analytics?.notifications.filter(n => !n.read).length || 0;
  const recentApplications = analytics?.applications.slice(0, 3) || [];
  const topSkills = analytics?.skills.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gov-navy mb-2 flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-gov-saffron" />
                User Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your profile, track applications, and monitor your progress
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/internship')}
                className="bg-gov-green hover:bg-gov-green/90 text-white"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Apply for Internships
              </Button>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Analytics Overview Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gov-navy">{analytics.totalApplications}</p>
                      <p className="text-sm text-gray-600">Total Applications</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gov-navy">{analytics.successRate}%</p>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gov-navy">{analytics.profileCompleteness}%</p>
                      <p className="text-sm text-gray-600">Profile Complete</p>
                    </div>
                    <Target className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gov-navy">{unreadNotifications}</p>
                      <p className="text-sm text-gray-600">New Notifications</p>
                    </div>
                    <Bell className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{app.position}</p>
                          <p className="text-sm text-gray-600">{app.companyName}</p>
                        </div>
                        <Badge 
                          variant={
                            app.status === 'accepted' ? 'default' :
                            app.status === 'rejected' ? 'destructive' :
                            app.status === 'interview_scheduled' ? 'secondary' :
                            'outline'
                          }
                        >
                          {app.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                    {recentApplications.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No applications yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Top Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSkills.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant="outline">{skill.level}</Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gov-navy h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${
                                skill.level === 'expert' ? 100 :
                                skill.level === 'advanced' ? 80 :
                                skill.level === 'intermediate' ? 60 : 40
                              }%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {topSkills.length === 0 && (
                      <p className="text-gray-500 text-center py-4">Add skills to your profile</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application History</CardTitle>
                <CardDescription>Track all your internship applications and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics && analytics.applications.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.applications.map((app) => (
                      <div key={app.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{app.position}</h3>
                          <Badge 
                            variant={
                              app.status === 'accepted' ? 'default' :
                              app.status === 'rejected' ? 'destructive' :
                              app.status === 'interview_scheduled' ? 'secondary' :
                              'outline'
                            }
                          >
                            {app.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{app.companyName} • {app.sector}</p>
                        <p className="text-sm text-gray-500">Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
                        {app.interviewDate && (
                          <p className="text-sm text-blue-600">Interview: {new Date(app.interviewDate).toLocaleDateString()}</p>
                        )}
                        {app.offerDetails && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                            <p>Stipend: ₹{app.offerDetails.stipend.toLocaleString()}</p>
                            <p>Duration: {app.offerDetails.duration}</p>
                            <p>Location: {app.offerDetails.location}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No applications yet. Start applying for internships!</p>
                    <Button className="mt-4" onClick={() => router.push('/internship')}>
                      Browse Internships
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Assessment & Development</CardTitle>
                <CardDescription>Track your skills and get improvement suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics && analytics.skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analytics.skills.map((skill, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold">{skill.name}</h3>
                          <Badge variant="outline">{skill.level}</Badge>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Proficiency</span>
                            <span>{skill.endorsements} endorsements</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gov-navy h-2 rounded-full"
                              style={{ 
                                width: `${
                                  skill.level === 'expert' ? 100 :
                                  skill.level === 'advanced' ? 80 :
                                  skill.level === 'intermediate' ? 60 : 40
                                }%` 
                              }}
                            />
                          </div>
                        </div>
                        {skill.improvementSuggestions && skill.improvementSuggestions.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Improvement Suggestions:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {skill.improvementSuggestions.map((suggestion, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Add skills to your profile to track your development</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                  {unreadNotifications > 0 && (
                    <Badge variant="destructive">{unreadNotifications}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics && analytics.notifications.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                        }`}
                        onClick={() => markNotificationRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{notification.title}</h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <Badge 
                                variant={
                                  notification.priority === 'high' ? 'destructive' :
                                  notification.priority === 'medium' ? 'default' : 'secondary'
                                }
                                className="text-xs"
                              >
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{notification.message}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture & Basic Info */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Profile Picture
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      {profileData.profileImage ? (
                        <Image
                          src={profileData.profileImage}
                          alt="Profile"
                          width={128}
                          height={128}
                          className="rounded-full object-cover border-4 border-gov-saffron"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gov-saffron flex items-center justify-center text-white text-4xl font-bold">
                          {profileData.firstName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {profileData.firstName} {profileData.lastName}
                    </p>
                    {analytics && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Profile Completeness</p>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                          <div 
                            className="bg-gov-navy h-3 rounded-full transition-all duration-300"
                            style={{ width: `${analytics.profileCompleteness}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600">{analytics.profileCompleteness}% complete</p>
                      </div>
                    )}
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newImage = prompt('Enter image URL:');
                          if (newImage) {
                            handleInputChange('profileImage', newImage);
                          }
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          Update your profile details and preferences
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {!isEditing ? (
                          <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-gov-saffron hover:bg-gov-saffron/90 text-white"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              onClick={handleCancel}
                              disabled={isLoading}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSave}
                              disabled={isLoading}
                              className="bg-gov-navy hover:bg-gov-navy/90 text-white"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        value={profileData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your address"
                        rows={3}
                      />
                    </div>

                    {/* Professional Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-gov-saffron" />
                        Professional Information
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="skills" className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Skills
                          </Label>
                          <Textarea
                            id="skills"
                            value={profileData.skills}
                            onChange={(e) => handleInputChange('skills', e.target.value)}
                            disabled={!isEditing}
                            placeholder="List your skills (e.g., Python, JavaScript, React, etc.)"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="workExperience" className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Work Experience
                          </Label>
                          <Textarea
                            id="workExperience"
                            value={profileData.workExperience}
                            onChange={(e) => handleInputChange('workExperience', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Describe your work experience"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="education" className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Education
                          </Label>
                          <Textarea
                            id="education"
                            value={profileData.education}
                            onChange={(e) => handleInputChange('education', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Describe your educational background"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="careerObjective" className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Career Objective
                          </Label>
                          <Textarea
                            id="careerObjective"
                            value={profileData.careerObjective}
                            onChange={(e) => handleInputChange('careerObjective', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Describe your career goals and objectives"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserDashboardContent;
