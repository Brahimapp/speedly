# Speedly Web Application Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Deployment](#deployment)
6. [Customization](#customization)

## Overview

Speedly is a progressive web application (PWA) built with React, TypeScript, and Tailwind CSS. It provides speed limit detection and monitoring capabilities through a mobile device's camera and GPS.

## Features

### Core Features
- Real-time speed monitoring
- Speed limit detection via camera
- Historical speed records
- User authentication
- Premium subscription system
- Mobile-specific features (camera, GPS)
- Cross-platform dashboard access

### User Tiers
- **Free Users**: 30-minute daily sessions
- **Premium Users**: Unlimited access and additional features

## Installation

### Prerequisites
- Node.js 18.0 or higher
- npm 8.0 or higher

### Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd speedly
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Speedly
VITE_API_URL=your-api-url
```

### Authentication Setup
The application uses a custom authentication system. Configure the auth provider in `src/context/AuthContext.tsx`.

## Deployment

### Standard Web Server Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the contents of the `dist` directory to your web server.

### cPanel Hosting Deployment

1. Build the application locally:
```bash
npm run build
```

2. Upload to cPanel:
   - Log into cPanel
   - Navigate to File Manager
   - Upload the contents of the `dist` directory to your public_html folder or a subdirectory

3. Configure .htaccess:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

## Customization

### Modifying Features

#### Speed Detection Settings
Edit `src/context/SpeedlyContext.tsx`:
```typescript
// Customize speed limit thresholds
const SPEED_THRESHOLD = 10; // mph over limit for warnings
```

#### UI Customization
Modify the Tailwind theme in `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Customize colors
        }
      }
    }
  }
}
```

#### Session Duration
Adjust free user session duration in `src/context/SpeedlyContext.tsx`:
```typescript
const FREE_SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
```

### Adding New Features

1. Create new components in `src/components/`
2. Add routes in `src/App.tsx`
3. Create context providers if needed in `src/context/`

### Premium Features
To modify premium features, edit `src/components/SessionExpiredModal.tsx` and update the premium features list.

## Security Considerations

- Ensure proper HTTPS configuration on deployment
- Implement rate limiting for API endpoints
- Regular security audits
- Keep dependencies updated

## Performance Optimization

- Use React.lazy for route-based code splitting
- Optimize images and assets
- Implement proper caching strategies
- Monitor bundle size

## Troubleshooting

Common issues and solutions:

1. Camera Access Issues
   - Check browser permissions
   - Ensure HTTPS in production
   - Verify device compatibility

2. GPS Problems
   - Check location permissions
   - Verify GPS sensor availability
   - Test in different environments

3. Authentication Errors
   - Clear browser cache
   - Check network connectivity
   - Verify credentials format

## Support

For technical support or feature requests:
- Create an issue in the repository
- Contact support@speedly.com
- Join our Discord community

## License

This project is licensed under the MIT License - see the LICENSE file for details.