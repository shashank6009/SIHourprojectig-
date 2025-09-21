# PM Internship Scheme Portal - Production Setup Guide

## Overview
This document outlines the steps required to deploy the PM Internship Scheme portal to production.

## Prerequisites

### Environment Variables
Create a `.env.local` file with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=https://your-production-domain.com

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# ML API Configuration
ML_API_BASE_URL=https://web-production-c72b1.up.railway.app

# Database (if implementing persistent storage)
DATABASE_URL=your-database-connection-string
```

### Required Services
1. **ML API Service**: Ensure the Railway ML API is running and accessible
2. **Google OAuth**: Configure Google Cloud Console for authentication
3. **Domain & SSL**: Set up your production domain with SSL certificate

## Build & Deployment

### 1. Install Dependencies
```bash
npm install --production
```

### 2. Build the Application
```bash
npm run build
```

### 3. Start Production Server
```bash
npm start
```

## Performance Optimizations

### Implemented Features
- ✅ Code splitting and lazy loading
- ✅ Image optimization with Next.js Image component
- ✅ Static asset caching headers
- ✅ Gzip compression
- ✅ Bundle optimization
- ✅ PWA support for offline functionality
- ✅ Service worker caching
- ✅ IndexedDB for offline data storage

### Recommended Infrastructure
- **CDN**: Use Cloudflare or AWS CloudFront for static assets
- **Load Balancer**: For high availability
- **Database**: PostgreSQL or MongoDB for persistent data
- **Redis**: For session storage and caching
- **Monitoring**: Set up error tracking (Sentry) and analytics

## Security Features

### Implemented
- ✅ CSRF protection via NextAuth
- ✅ XSS protection headers
- ✅ Content Security Policy headers
- ✅ Secure session management
- ✅ Input validation and sanitization
- ✅ Rate limiting on API routes

### Production Checklist
- [ ] Enable HTTPS only
- [ ] Configure proper CORS policies
- [ ] Set up Web Application Firewall (WAF)
- [ ] Enable audit logging
- [ ] Configure backup strategies
- [ ] Set up monitoring and alerting

## Deployment Platforms

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Traditional VPS
1. Set up Node.js environment
2. Configure reverse proxy (Nginx)
3. Set up process manager (PM2)
4. Configure SSL certificates

## Monitoring & Maintenance

### Health Checks
- API endpoint health: `/api/health`
- ML service connectivity
- Database connectivity
- Authentication service status

### Performance Metrics
- Page load times
- API response times
- Error rates
- User engagement metrics

### Backup Strategy
- Database backups (daily)
- User data exports
- Configuration backups
- Code repository backups

## Troubleshooting

### Common Issues
1. **ML API Connection Errors**: Check Railway service status and network connectivity
2. **Authentication Issues**: Verify Google OAuth configuration and redirect URIs
3. **Performance Issues**: Monitor bundle size and implement additional code splitting
4. **Offline Functionality**: Ensure service worker is properly registered

### Support Contacts
- Technical Support: [your-email@domain.com]
- ML API Issues: Railway support
- Authentication: Google Cloud Console support

## Version Information
- Next.js: 15.5.2
- React: 18+
- Node.js: 18+
- TypeScript: 5+

## License
Government of India - PM Internship Scheme Portal
