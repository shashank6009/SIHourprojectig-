// Shared in-memory storage for users
// In production, this would be replaced with a database

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for Google OAuth users
  provider: 'credentials' | 'google';
  googleId?: string;
  profileImage?: string;
  createdAt: Date;
  lastLogin?: Date;
  profileData?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    highestQualification?: string;
    university?: string;
    course?: string;
    graduationYear?: string;
    cgpa?: string;
    currentStatus?: string;
    workExperience?: string;
    skills?: string;
    languages?: string;
    aadhaarNumber?: string;
    bankAccountNumber?: string;
    ifscCode?: string;
    panNumber?: string;
    category?: string;
    preferredInternshipDuration?: string;
    preferredLocation?: string;
    careerObjective?: string;
  };
}

export const users: User[] = [];

// Helper functions
export function findUserByEmail(email: string): User | undefined {
  return users.find(user => user.email === email);
}

export function findUserByGoogleId(googleId: string): User | undefined {
  return users.find(user => user.googleId === googleId);
}

export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...userData,
    createdAt: new Date(),
    lastLogin: new Date(),
  };
  users.push(newUser);
  return newUser;
}

export function createOrUpdateGoogleUser(googleProfile: {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}): User {
  // Check if user already exists by Google ID
  let user = findUserByGoogleId(googleProfile.id);
  
  if (user) {
    // Update existing user
    user.name = googleProfile.name;
    user.profileImage = googleProfile.picture;
    user.lastLogin = new Date();
    return user;
  }
  
  // Check if user exists by email
  user = findUserByEmail(googleProfile.email);
  
  if (user) {
    // Link Google account to existing user
    user.googleId = googleProfile.id;
    user.provider = 'google';
    user.profileImage = googleProfile.picture;
    user.lastLogin = new Date();
    return user;
  }
  
  // Create new user
  return createUser({
    name: googleProfile.name,
    email: googleProfile.email,
    provider: 'google',
    googleId: googleProfile.id,
    profileImage: googleProfile.picture,
  });
}

export function updateUserProfile(userId: string, profileData: Partial<User['profileData']>): User | null {
  const user = users.find(u => u.id === userId);
  if (user) {
    user.profileData = { ...user.profileData, ...profileData };
    return user;
  }
  return null;
}
