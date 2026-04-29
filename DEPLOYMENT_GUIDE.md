# 🚀 SafeStories Deployment Guide

## Overview
This guide walks you through deploying the migrated SafeStories application to Render.

## 📋 Pre-Deployment Checklist

### Required Services
- [ ] **PostgreSQL Database** (Render PostgreSQL or external)
- [ ] **MinIO/S3 Storage** (existing or new)
- [ ] **Gmail Account** (with app password)
- [ ] **Render Account** (free tier available)

### Required Information
- [ ] Database connection string
- [ ] MinIO credentials and endpoint
- [ ] Gmail credentials (email + app password)
- [ ] GitHub repository access

## 🗄️ Database Setup

### Option 1: Render PostgreSQL (Recommended)
1. Go to Render Dashboard → New → PostgreSQL
2. Choose plan (free tier available)
3. Note the connection details:
   - **Internal Database URL**: For backend service
   - **External Database URL**: For external connections

### Option 2: External PostgreSQL
1. Use your existing PostgreSQL instance
2. Ensure it's accessible from Render's IP ranges
3. Create connection string: `postgresql://user:password@host:port/database`

## 🔧 Backend Deployment

### Step 1: Create Web Service
1. **Go to Render Dashboard** → New → Web Service
2. **Connect Repository**: Select your GitHub repository
3. **Configure Service**:
   - **Name**: `safestories-api`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: `backend`

### Step 2: Build & Start Commands
```bash
# Build Command
npm install && npm run build

# Start Command  
npm start
```

### Step 3: Environment Variables
Add these environment variables in Render:

```env
NODE_ENV=production
PORT=10000

# Database
DATABASE_URL=<your-database-url>

# Email
EMAIL_USER=<your-gmail-address>
EMAIL_PASS=<your-gmail-app-password>

# MinIO
MINIO_ENDPOINT=<your-minio-endpoint>
MINIO_PORT=<your-minio-port>
MINIO_USE_SSL=<true-or-false>
MINIO_ACCESS_KEY=<your-access-key>
MINIO_SECRET_KEY=<your-secret-key>
MINIO_BUCKET_NAME=<your-bucket-name>

# Frontend URL (will be updated after frontend deployment)
FRONTEND_URL=https://safestories-app.onrender.com
```

### Step 4: Health Check
- **Health Check Path**: `/health`
- Render will monitor this endpoint

### Step 5: Deploy
1. Click **Create Web Service**
2. Wait for deployment (5-10 minutes)
3. Note the service URL: `https://safestories-api-XXXX.onrender.com`

## 🌐 Frontend Deployment

### Step 1: Create Static Site
1. **Go to Render Dashboard** → New → Static Site
2. **Connect Repository**: Same repository as backend
3. **Configure Site**:
   - **Name**: `safestories-app`
   - **Branch**: `main`
   - **Root Directory**: `frontend`

### Step 2: Build Settings
```bash
# Build Command
npm install && npm run build

# Publish Directory
dist
```

### Step 3: Environment Variables
```env
# API URL (use your backend service URL)
VITE_API_URL=https://safestories-api-XXXX.onrender.com
```

### Step 4: Deploy
1. Click **Create Static Site**
2. Wait for deployment (3-5 minutes)  
3. Note the site URL: `https://safestories-app-XXXX.onrender.com`

## 🔄 Update Backend with Frontend URL

### After Frontend Deployment
1. Go to your backend service in Render
2. Update the `FRONTEND_URL` environment variable:
   ```env
   FRONTEND_URL=https://safestories-app-XXXX.onrender.com
   ```
3. Redeploy the backend service

## ✅ Deployment Verification

### 1. Backend Health Check
```bash
curl https://safestories-api-XXXX.onrender.com/health
```
**Expected Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-04-29T...",
  "environment": "production"
}
```

### 2. Frontend Access
- Visit: `https://safestories-app-XXXX.onrender.com`
- Should show the login page
- Check browser console for any errors

### 3. API Connectivity Test
```bash
curl -X POST https://safestories-api-XXXX.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### 4. Database Connection
- Check backend logs in Render dashboard
- Look for successful database connection messages

## 🌍 Custom Domain Setup (Optional)

### Backend Domain
1. **In Render Dashboard** → Your backend service → Settings
2. **Custom Domains** → Add `api.yourdomain.com`
3. **Update DNS**: Add CNAME record pointing to Render URL
4. **SSL**: Render provides free SSL certificates

### Frontend Domain  
1. **In Render Dashboard** → Your frontend service → Settings
2. **Custom Domains** → Add `app.yourdomain.com` or `yourdomain.com`
3. **Update DNS**: Add CNAME record pointing to Render URL
4. **Update Backend**: Update `FRONTEND_URL` environment variable

## 🔧 Post-Deployment Configuration

### Update Environment Variables
After custom domains are set up:

**Backend**:
```env
FRONTEND_URL=https://app.yourdomain.com
```

**Frontend**:
```env
VITE_API_URL=https://api.yourdomain.com
```

### DNS Migration (Final Step)
1. **Test thoroughly** on Render URLs
2. **Update DNS** to point to new services:
   - `api.yourdomain.com` → Backend service
   - `app.yourdomain.com` → Frontend service
3. **Monitor** for any issues
4. **Update** any hardcoded URLs in external services

## 📊 Monitoring & Maintenance

### Render Dashboard Monitoring
- **Service Status**: Green = healthy, Red = issues
- **Metrics**: CPU, Memory, Response times
- **Logs**: Real-time application logs
- **Deployments**: History and rollback options

### Health Monitoring
```bash
# Automated health check script
#!/bin/bash
BACKEND_URL="https://safestories-api-XXXX.onrender.com"
FRONTEND_URL="https://safestories-app-XXXX.onrender.com"

# Check backend health
curl -f $BACKEND_URL/health || echo "Backend health check failed"

# Check frontend availability  
curl -f $FRONTEND_URL || echo "Frontend availability check failed"
```

### Log Monitoring
- **Backend Logs**: Render Dashboard → Service → Logs
- **Key Metrics**: Database connections, API response times, errors
- **Alerts**: Set up external monitoring (e.g., UptimeRobot)

## 🚨 Troubleshooting

### Common Deployment Issues

#### Backend Build Fails
```bash
# Check package.json scripts
"scripts": {
  "build": "tsc",
  "start": "node dist/app.js"
}

# Verify TypeScript compilation
npm run build
```

#### Frontend Build Fails
```bash
# Check Vite configuration
# Verify all dependencies in package.json
npm install
npm run build
```

#### Database Connection Issues
1. **Check connection string format**:
   ```
   postgresql://user:password@host:port/database
   ```
2. **Verify database is accessible**
3. **Check environment variable name**: `DATABASE_URL`

#### CORS Errors
1. **Verify frontend URL** in backend CORS configuration
2. **Check environment variables**:
   - Backend: `FRONTEND_URL`
   - Frontend: `VITE_API_URL`

#### Email Not Working
1. **Gmail App Password**: Use app password, not regular password
2. **2FA Required**: Enable 2-factor authentication on Gmail
3. **Environment Variables**: `EMAIL_USER` and `EMAIL_PASS`

### Getting Help
1. **Check Render Logs**: Dashboard → Service → Logs
2. **Review Environment Variables**: Ensure all are set correctly
3. **Test Locally**: Verify everything works in development
4. **Check Service Status**: Render status page for outages

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Database set up and accessible
- [ ] MinIO/S3 credentials ready
- [ ] Gmail app password created
- [ ] Repository pushed to GitHub
- [ ] Environment variables documented

### Backend Deployment
- [ ] Web service created
- [ ] Build/start commands configured
- [ ] Environment variables added
- [ ] Health check configured
- [ ] Service deployed successfully
- [ ] Health endpoint responding

### Frontend Deployment  
- [ ] Static site created
- [ ] Build settings configured
- [ ] API URL environment variable set
- [ ] Site deployed successfully
- [ ] Login page accessible

### Post-Deployment
- [ ] Backend updated with frontend URL
- [ ] End-to-end testing completed
- [ ] Custom domains configured (if needed)
- [ ] DNS updated (if needed)
- [ ] Monitoring set up
- [ ] Team notified of new URLs

## 🎉 Success!

Your SafeStories application is now successfully deployed on Render with:
- ✅ **Scalable Backend**: Dedicated Express.js server
- ✅ **Fast Frontend**: Static site with CDN
- ✅ **Reliable Database**: PostgreSQL with connection pooling
- ✅ **Secure Configuration**: Environment-based secrets
- ✅ **Health Monitoring**: Built-in health checks
- ✅ **Easy Maintenance**: Render dashboard management

**Next Steps**: Monitor the application, set up alerts, and enjoy the improved performance and scalability!