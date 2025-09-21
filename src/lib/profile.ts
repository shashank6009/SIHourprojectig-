// Profile data types and storage utilities

export interface ProfileData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  // Educational Information
  highestQualification: string;
  university: string;
  course: string;
  graduationYear: string;
  cgpa: string;
  
  // Professional Information
  currentStatus: string;
  workExperience: string;
  skills: string;
  languages: string;
  
  // PMIS Specific
  aadhaarNumber: string;
  bankAccountNumber: string;
  ifscCode: string;
  panNumber: string;
  
  // Additional Information
  disability?: string;
  category: string;
  preferredInternshipDuration: string;
  preferredLocation: string;
  careerObjective: string;
  
  // Profile Picture
  profileImage?: string;
  
  // Metadata
  lastUpdated: string;
  userId: string;
}

// Default profile data - empty for new users
export const defaultProfileData: ProfileData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  nationality: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  highestQualification: '',
  university: '',
  course: '',
  graduationYear: '',
  cgpa: '',
  currentStatus: '',
  workExperience: '',
  skills: '',
  languages: '',
  aadhaarNumber: '',
  bankAccountNumber: '',
  ifscCode: '',
  panNumber: '',
  category: '',
  preferredInternshipDuration: '',
  preferredLocation: '',
  careerObjective: '',
  lastUpdated: new Date().toISOString(),
  userId: '',
};

// Profile storage utilities
export class ProfileStorage {
  private static STORAGE_KEY = 'pmis_profile_data';

  // Save profile data to localStorage
  static saveProfile(profileData: ProfileData): void {
    try {
      const dataToSave = {
        ...profileData,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
      console.log('Profile saved successfully:', dataToSave);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }

  // Load profile data from localStorage
  static loadProfile(): ProfileData | null {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('Profile loaded successfully:', parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
    return null;
  }

  // Clear profile data
  static clearProfile(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Profile cleared successfully');
    } catch (error) {
      console.error('Error clearing profile:', error);
    }
  }

  // Check if profile exists
  static hasProfile(): boolean {
    return this.loadProfile() !== null;
  }

  // Get profile for specific user
  static getProfileForUser(userId: string): ProfileData | null {
    const profile = this.loadProfile();
    if (profile && profile.userId === userId) {
      return profile;
    }
    return null;
  }

  // Update profile for specific user
  static updateProfileForUser(userId: string, profileData: Partial<ProfileData>): void {
    const existingProfile = this.loadProfile();
    const updatedProfile: ProfileData = {
      ...defaultProfileData,
      ...existingProfile,
      ...profileData,
      userId,
      lastUpdated: new Date().toISOString(),
    };
    this.saveProfile(updatedProfile);
  }
}

// Utility functions for form integration
export class ProfileFormUtils {
  // Get education data for internship form
  static getEducationData(profile: ProfileData) {
    return {
      university: profile.university,
      degree: profile.highestQualification,
      course: profile.course,
      graduationYear: profile.graduationYear,
      cgpa: profile.cgpa,
    };
  }

  // Get professional data for internship form
  static getProfessionalData(profile: ProfileData) {
    return {
      currentStatus: profile.currentStatus,
      workExperience: profile.workExperience,
      skills: profile.skills ? profile.skills.split(',').map(skill => skill.trim()) : [],
      languages: profile.languages ? profile.languages.split(',').map(lang => lang.trim()) : [],
    };
  }

  // Get personal data for internship form
  static getPersonalData(profile: ProfileData) {
    return {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      nationality: profile.nationality,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      pincode: profile.pincode,
    };
  }

  // Get PMIS specific data
  static getPMISData(profile: ProfileData) {
    return {
      aadhaarNumber: profile.aadhaarNumber,
      panNumber: profile.panNumber,
      bankAccountNumber: profile.bankAccountNumber,
      ifscCode: profile.ifscCode,
      category: profile.category,
      preferredDuration: profile.preferredInternshipDuration,
      preferredLocation: profile.preferredLocation,
      careerObjective: profile.careerObjective,
    };
  }
}
