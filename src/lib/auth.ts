import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { users, findUserByEmail, createOrUpdateGoogleUser } from "@/lib/users";

// Demo users for testing
const demoUsers = [
  {
    id: "demo_user_1",
    name: "Demo User",
    email: "demo@pmis.gov.in",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8K8K8K8", // password123
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider - Always enabled for demo
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "demo-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo-google-client-secret",
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'select_account',
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Check demo users first
          const demoUser = demoUsers.find(user => user.email === credentials.email);
          if (demoUser && credentials.password === "password123") {
            return {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
            };
          }

          // Check registered users (in-memory storage)
          // In production, this would query a database
          const user = findUserByEmail(credentials.email);
          
          if (user && user.password && await bcrypt.compare(credentials.password, user.password)) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.profileImage,
            };
          }

          throw new Error("Invalid email or password");
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error instanceof Error ? error.message : "Authentication failed");
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Store user data in token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      
      // Store account provider info
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
      }
      
      // Store Google profile data
      if (profile && account?.provider === 'google') {
        token.googleProfile = {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          given_name: profile.given_name,
          family_name: profile.family_name,
          locale: profile.locale,
        };
      }
      
      return token;
    },
    async session({ session, token }) {
      // Add user data to session
      if (token) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
        session.user.image = token.image as string;
        
        // Add Google profile data if available
        if (token.googleProfile) {
          session.user.googleProfile = token.googleProfile;
        }
      }
      
      return session;
    },
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-ins
      if (account?.provider === 'google' && profile) {
        try {
          // Create or update user with Google profile data
          const googleUser = createOrUpdateGoogleUser({
            id: profile.sub,
            email: profile.email!,
            name: profile.name!,
            picture: profile.picture,
            given_name: profile.given_name,
            family_name: profile.family_name,
          });
          
          // Update the user object with our internal user data
          user.id = googleUser.id;
          user.name = googleUser.name;
          user.email = googleUser.email;
          user.image = googleUser.profileImage;
          
          return true;
        } catch (error) {
          console.error('Google OAuth sign-in error:', error);
          return false;
        }
      }
      
      // Allow credentials sign-ins
      if (account?.provider === 'credentials') {
        return true;
      }
      
      return false;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only-change-in-production",
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
};
