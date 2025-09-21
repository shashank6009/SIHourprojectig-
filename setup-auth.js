#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Authentication for PM Internship Portal...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env.local already exists');
} else {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-for-nextauth-development-2024-change-in-production

# Google OAuth Configuration
# Get these from: https://console.developers.google.com/
# 1. Go to Google Cloud Console
# 2. Create a new project or select existing project
# 3. Enable Google+ API
# 4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
# 5. Set Application type to "Web application"
# 6. Add authorized redirect URIs:
#    - http://localhost:3000/api/auth/callback/google (development)
#    - https://yourdomain.com/api/auth/callback/google (production)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# ML API Configuration
NEXT_PUBLIC_ML_API_URL=https://web-production-c72b1.up.railway.app

# Google OAuth Enable Flag (set to true when you have Google credentials)
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=false`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created successfully');
}

console.log('\n📋 Next Steps:');
console.log('1. 🔑 Get Google OAuth Credentials:');
console.log('   - Go to: https://console.developers.google.com/');
console.log('   - Create/select a project');
console.log('   - Enable Google+ API');
console.log('   - Create OAuth 2.0 Client ID');
console.log('   - Add redirect URI: http://localhost:3000/api/auth/callback/google');
console.log('   - Copy Client ID and Client Secret');
console.log('');
console.log('2. ⚙️  Update .env.local:');
console.log('   - Replace GOOGLE_CLIENT_ID with your actual Client ID');
console.log('   - Replace GOOGLE_CLIENT_SECRET with your actual Client Secret');
console.log('   - Set NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true');
console.log('');
console.log('3. 🚀 Start the application:');
console.log('   - Run: npm run dev');
console.log('   - Visit: http://localhost:3000/register');
console.log('');
console.log('🎉 Authentication setup complete!');
console.log('');
console.log('📝 Available Features:');
console.log('✅ User Registration (/register)');
console.log('✅ User Login (/login)');
console.log('✅ Google OAuth (when configured)');
console.log('✅ Demo Credentials (demo@pmis.gov.in / password123)');
console.log('✅ Protected Routes');
console.log('✅ Session Management');
