'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Award, 
  LogOut,
  Settings,
  FileText,
  TrendingUp,
  Clock,
  BookOpen,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

export default function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = () => {
      try {
        if (session?.user) {
          const userId = session.user.email || session.user.id;
          const savedProfile = localStorage.getItem(`profile_${userId}`);
          
          if (savedProfile) {
            setProfileData(JSON.parse(savedProfile));
          }
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'loading') {
      return; // Still loading session
    }

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session) {
      loadProfileData();
    }
  }, [session, status, router]);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Show loading state while session is being loaded
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gov-saffron mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gov-saffron mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const getMockStats = () => {
    return {
      applicationsSubmitted: 3,
      applicationsPending: 1,
      applicationsAccepted: 2,
      currentStreak: 7,
      longestStreak: 15
    };
  };

  const getRecentActivity = () => {
    return [
      {
        id: 1,
        type: 'application',
        title: 'Application submitted for Software Development Internship',
        time: '2 hours ago',
        status: 'pending'
      },
      {
        id: 2,
        type: 'profile',
        title: 'Profile updated with new skills',
        time: '1 day ago',
        status: 'completed'
      },
      {
        id: 3,
        type: 'application',
        title: 'Application accepted for Data Science Internship',
        time: '3 days ago',
        status: 'accepted'
      }
    ];
  };

  const getUpcomingDeadlines = () => {
    return [
      {
        id: 1,
        title: 'Application deadline for AI/ML Internship',
        deadline: '2024-01-15',
        priority: 'high'
      },
      {
        id: 2,
        title: 'Document submission for accepted internship',
        deadline: '2024-01-20',
        priority: 'medium'
      }
    ];
  };

  const stats = getMockStats();
  const recentActivity = getRecentActivity();
  const upcomingDeadlines = getUpcomingDeadlines();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.user.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your internship applications
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => router.push('/profile')}>
              <Settings className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gov-saffron rounded-full flex items-center justify-center">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {session.user.name || 'User'}
                </h3>
                <p className="text-gray-600 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {session.user.email}
                </p>
                <Badge variant="secondary" className="mt-2">
                  Active Member
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.applicationsSubmitted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.applicationsPending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.applicationsAccepted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.currentStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Best Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.longestStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest internship-related activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'accepted' ? 'bg-green-100' :
                      activity.status === 'pending' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.status === 'accepted' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : activity.status === 'pending' ? (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <FileText className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>
                Important dates to keep track of
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {deadline.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(deadline.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      deadline.priority === 'high' ? 'destructive' :
                      deadline.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {deadline.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push('/internship')}
              >
                <Briefcase className="w-6 h-6" />
                <span>Apply for Internship</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push('/profile')}
              >
                <User className="w-6 h-6" />
                <span>Update Profile</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push('/internship/recommendations')}
              >
                <Target className="w-6 h-6" />
                <span>View Recommendations</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
