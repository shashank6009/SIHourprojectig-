// Demo Google OAuth simulation for testing without real credentials
export const simulateGoogleAuth = async () => {
  // Simulate Google OAuth flow
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        user: {
          id: 'google_demo_user_123',
          email: 'demo.user@gmail.com',
          name: 'Demo Google User',
          image: 'https://via.placeholder.com/150/4285f4/ffffff?text=G',
          provider: 'google',
          googleProfile: {
            id: 'google_demo_user_123',
            email: 'demo.user@gmail.com',
            name: 'Demo Google User',
            picture: 'https://via.placeholder.com/150/4285f4/ffffff?text=G',
            given_name: 'Demo',
            family_name: 'User',
            locale: 'en',
          }
        }
      });
    }, 1000);
  });
};

export const createDemoGoogleUser = () => {
  return {
    id: 'google_demo_user_123',
    email: 'demo.user@gmail.com',
    name: 'Demo Google User',
    profileImage: 'https://via.placeholder.com/150/4285f4/ffffff?text=G',
    provider: 'google',
    googleId: 'google_demo_user_123',
    lastLogin: new Date().toISOString(),
    profileData: {
      firstName: 'Demo',
      lastName: 'User',
      phone: '+91 98765 43210',
      address: '123 Demo Street, Demo City, Demo State 123456',
      skills: 'React, Next.js, TypeScript, Google OAuth',
      workExperience: '2 years in web development',
      education: 'B.Tech Computer Science',
      careerObjective: 'To contribute to innovative government technology projects'
    }
  };
};
