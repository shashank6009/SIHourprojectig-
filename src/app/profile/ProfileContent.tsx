'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProfileStorage, ProfileData } from '@/lib/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Camera
} from 'lucide-react';
import Image from 'next/image';

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

function ProfileContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
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

  // Load profile data on component mount
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Load profile data from localStorage
    const loadProfileData = () => {
      try {
        const userId = session?.user?.email || 'demo@pmis.gov.in';
        const savedProfile = ProfileStorage.getProfileForUser(userId);
        
        if (savedProfile) {
          // Convert ProfileData to our form format
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
          // Initialize with session data
          const user = session.user;
          const fullName = user?.name || '';
          const nameParts = fullName.split(' ').filter(part => part.trim().length > 0);
          
          // Better name parsing with fallbacks
          let firstName = '';
          let lastName = '';
          
          if (nameParts.length === 0) {
            // No name provided, use email prefix
            firstName = user?.email?.split('@')[0] || 'User';
            lastName = '';
          } else if (nameParts.length === 1) {
            // Single name provided
            firstName = nameParts[0];
            lastName = '';
          } else {
            // Multiple names provided
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
          console.log('Initializing profile with session data:', {
            originalName: fullName,
            nameParts: nameParts,
            initialData: initialData
          });
          setProfileData(initialData);
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
        setError('Failed to load profile data');
      }
    };

    loadProfileData();
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
      // Validate required fields with specific messages
      const missingFields = [];
      if (!profileData.firstName?.trim()) missingFields.push('First Name');
      if (!profileData.email?.trim()) missingFields.push('Email Address');

      if (missingFields.length > 0) {
        throw new Error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Save to ProfileStorage
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
        // Set required fields with defaults
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
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Failed to save profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reload from localStorage to discard changes
    try {
      const savedData = localStorage.getItem('profile_data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setProfileData(parsed);
      }
    } catch (error) {
      console.error('Failed to reload profile data:', error);
    }
    setIsEditing(false);
    setError(null);
  };

  const handleApplyNow = () => {
    // Save current profile data using ProfileStorage
    try {
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
        // Set required fields with defaults
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
      console.log('Profile data saved before applying:', profileToSave);
    } catch (error) {
      console.error('Failed to save profile data before applying:', error);
    }
    
    // Navigate to internship application
    router.push('/internship');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gov-saffron mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
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
              Please log in to view your profile.
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gov-navy mb-2 flex items-center gap-2">
                <User className="w-8 h-8 text-gov-saffron" />
                Profile Management
              </h1>
              <p className="text-gray-600">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleApplyNow}
                className="bg-gov-green hover:bg-gov-green/90 text-white"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Apply Now
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
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

        {/* Profile Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture & Basic Info */}
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

          {/* Right Column - Form Fields */}
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
      </div>
    </div>
  );
}

export default ProfileContent;
