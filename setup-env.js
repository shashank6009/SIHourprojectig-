#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local already exists');
  process.exit(0);
}

// Create .env.local with default values
const envContent = `# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production-with-a-secure-random-string

# Google OAuth Configuration (Optional - leave empty to disable Google OAuth)
# Get these from: https://console.developers.google.com/
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=false

# ML API Configuration
ML_API_BASE_URL=https://web-production-c72b1.up.railway.app
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('📝 Please update the environment variables as needed');
  console.log('🔗 For Google OAuth setup, see: GOOGLE_OAUTH_SETUP.md');
} catch (error) {
  console.error('❌ Failed to create .env.local:', error.message);
  process.exit(1);
}
