# SafeStories Application - Render Migration

This repository contains the migrated SafeStories application, restructured for deployment on Render with separate backend and frontend services.

## 🏗️ Architecture

```
safestories-app/
├── backend/          # Express.js API Server
├── frontend/         # React/Vite Application  
├── shared/           # Shared types and utilities
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- MinIO/S3 storage
- Gmail account for email services

### Local Development

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://username:password@host:port/database
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
MINIO_ENDPOINT=s3.fluidjobs.ai
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

## 🌐 Deployment

### Render Deployment

#### Backend Service
1. Create a new Web Service on Render
2. Connect your repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables from backend/.env.example
6. Deploy

#### Frontend Service  
1. Create a new Static Site on Render
2. Connect your repository
3. Set build command: `npm install && npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`
6. Deploy

### Production URLs
- Backend API: `https://safestories-api.onrender.com`
- Frontend App: `https://safestories-app.onrender.com`

## 📁 Project Structure

### Backend (`/backend`)
```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   └── app.ts          # Main application
├── dist/               # Compiled JavaScript
├── package.json
├── tsconfig.json
└── render.yaml         # Render deployment config
```

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript types
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── dist/              # Build output
├── package.json
├── vite.config.ts
└── render.yaml        # Render deployment config
```

## 🔧 Key Changes from Vercel

### Backend Changes
- ✅ Consolidated `/server/index.ts` and `/api/*` into single Express app
- ✅ Removed Vercel-specific dependencies (`@vercel/node`)
- ✅ Updated database connection for dedicated server (more connections)
- ✅ Added proper CORS configuration for Render URLs
- ✅ Environment variable updates for Render deployment

### Frontend Changes  
- ✅ Updated API calls to use new backend URL
- ✅ Removed Vercel-specific environment checks
- ✅ Added Vite configuration for Render static hosting
- ✅ Updated build process for static site deployment

### Configuration Changes
- ✅ Replaced `vercel.json` with `render.yaml` files
- ✅ Updated environment variable names and structure
- ✅ Added health check endpoint for Render monitoring
- ✅ Configured proper CORS for cross-origin requests

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run dev
# Test health endpoint
curl http://localhost:3001/health
```

### Frontend Testing  
```bash
cd frontend
npm run dev
# Visit http://localhost:5173
```

### API Testing
```bash
# Test login endpoint
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

## 📊 Monitoring

### Health Checks
- Backend: `GET /health`
- Returns: `{"status":"OK","timestamp":"...","environment":"..."}`

### Logging
- All API requests are logged
- Database connection status
- Email service status
- File upload status

## 🔒 Security

### CORS Configuration
```javascript
cors({
  origin: [
    'http://localhost:5173',
    'https://safestories-app.onrender.com'
  ],
  credentials: true
})
```

### Environment Variables
- All sensitive data in environment variables
- No hardcoded credentials
- Separate development/production configs

## 🚨 Troubleshooting

### Common Issues

#### Backend won't start
- Check database connection string
- Verify all environment variables are set
- Check port availability (default: 3001)

#### Frontend can't connect to API
- Verify `VITE_API_URL` environment variable
- Check CORS configuration in backend
- Ensure backend is running and accessible

#### Database connection issues
- Verify PostgreSQL is running
- Check connection string format
- Ensure database exists and user has permissions

#### Email not sending
- Verify Gmail app password (not regular password)
- Check email service configuration
- Ensure 2FA is enabled on Gmail account

### Logs
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs  
cd frontend && npm run dev
```

## 📞 Support

For issues with this migration:
1. Check the troubleshooting section above
2. Verify environment variables are correctly set
3. Check Render service logs for deployment issues
4. Ensure database and external services are accessible

## 🔄 Migration Checklist

- [x] Backend consolidated and migrated
- [x] Frontend API calls updated
- [x] Environment variables configured
- [x] Render deployment configs created
- [x] CORS properly configured
- [x] Health checks implemented
- [x] Documentation updated
- [ ] Database migrated (pending)
- [ ] DNS updated (after testing)
- [ ] SSL certificates configured
- [ ] Monitoring setup