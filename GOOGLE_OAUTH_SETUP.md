# Google OAuth Setup Instructions

## Current Status
Google OAuth is now **ENABLED** but requires environment variables to function properly.

## To Enable Google OAuth:

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if required
6. Set **Application type** to "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3008/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 2. Create Environment Variables

Create a `.env.local` file in the project root:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3008
NEXTAUTH_SECRET=your-super-secret-key-for-nextauth-development-2024

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-google-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here

# ML API Configuration
NEXT_PUBLIC_ML_API_URL=https://web-production-c72b1.up.railway.app
```

### 3. Google OAuth is Already Enabled

✅ **Google OAuth has been restored in the code:**
- `src/lib/auth.ts` - GoogleProvider is active
- `src/app/login/page.tsx` - Google Sign-In button is visible

### 4. Test Google OAuth

1. Restart the development server: `npm run dev`
2. Navigate to `/login`
3. Click "Continue with Google"
4. Complete OAuth flow
5. Should redirect to `/dashboard`

## Demo Credentials (Always Available)

For testing without Google OAuth:
- **Email**: `demo@pmis.gov.in`
- **Password**: `password123`

## Current Working Features

Even with Google OAuth disabled, these features work:
- ✅ Demo login with credentials
- ✅ Intern form submission
- ✅ ML API integration
- ✅ AI-powered recommendations
- ✅ Profile management
- ✅ Offline functionality

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets for production
- Regularly rotate OAuth credentials
- Use HTTPS in production
