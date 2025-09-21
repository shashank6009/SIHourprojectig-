#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Google OAuth Setup for PM Internship Portal');
console.log('================================================\n');

console.log('📋 To get Google OAuth credentials:');
console.log('1. Go to: https://console.developers.google.com/');
console.log('2. Create a new project or select existing');
console.log('3. Enable Google+ API');
console.log('4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID');
console.log('5. Set Application type to "Web application"');
console.log('6. Add authorized redirect URI: http://localhost:3000/api/auth/callback/google');
console.log('7. Copy the Client ID and Client Secret\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupGoogleOAuth() {
  try {
    const clientId = await askQuestion('Enter your Google Client ID: ');
    const clientSecret = await askQuestion('Enter your Google Client Secret: ');
    
    if (!clientId || !clientSecret) {
      console.log('❌ Both Client ID and Client Secret are required');
      rl.close();
      return;
    }

    // Read existing .env.local
    const envPath = path.join(__dirname, '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    } else {
      envContent = `# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=pmis-secret-key-2024-production-ready-auth-system

# Google OAuth Configuration
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Enable Google OAuth
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true

# ML API Configuration
ML_API_BASE_URL=https://web-production-c72b1.up.railway.app
`;
    }

    // Update Google OAuth credentials
    envContent = envContent.replace(
      /GOOGLE_CLIENT_ID=.*/,
      `GOOGLE_CLIENT_ID=${clientId}`
    );
    envContent = envContent.replace(
      /GOOGLE_CLIENT_SECRET=.*/,
      `GOOGLE_CLIENT_SECRET=${clientSecret}`
    );
    envContent = envContent.replace(
      /NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=.*/,
      `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true`
    );

    // Write updated .env.local
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Google OAuth configured successfully!');
    console.log('🔄 Please restart your development server: npm run dev');
    console.log('🌐 Then visit: http://localhost:3000/login');
    console.log('🔐 Click "Sign in with Google" to test the OAuth flow\n');
    
    console.log('📝 Demo credentials (always available):');
    console.log('   Email: demo@pmis.gov.in');
    console.log('   Password: password123\n');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setupGoogleOAuth();
