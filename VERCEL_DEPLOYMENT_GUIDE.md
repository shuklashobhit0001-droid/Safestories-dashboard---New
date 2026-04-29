# Vercel Frontend + Render Backend Deployment Guide

## Architecture Overview

```
┌─────────────────┐         HTTPS          ┌──────────────────┐
│                 │ ───────────────────────>│                  │
│  Vercel         │                         │  Render          │
│  (Frontend)     │<─────────────────────── │  (Backend API)   │
│  Static Site    │      JSON Response      │  Node.js Server  │
└─────────────────┘                         └──────────────────┘
```

## Step 1: Deploy Backend on Render (Already Done ✅)

Your backend should already be deployed on Render. If not:

1. Go to https://render.com
2. Create a new **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables (database, email, MinIO, etc.)
6. Deploy

**Note your backend URL**: `https://your-backend-name.onrender.com`

---

## Step 2: Deploy Frontend on Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to**: https://vercel.com
2. **Sign up/Login** with GitHub
3. Click **"Add New Project"**
4. **Import** your GitHub repository
5. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. **Add Environment Variable**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-name.onrender.com` (your Render backend URL)

7. Click **"Deploy"**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend folder
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? safestories-frontend
# - Directory? ./
# - Override settings? No

# Set environment variable
vercel env add VITE_API_URL production
# Enter: https://your-backend-name.onrender.com

# Deploy to production
vercel --prod
```

---

## Step 3: Update Backend CORS

After deploying frontend, update your backend's CORS settings to allow requests from Vercel:

### Update `backend/.env` on Render:

Add your Vercel URL to the environment variables:

```env
FRONTEND_URL=https://your-app-name.vercel.app
```

### The backend already has CORS configured in `backend/src/app.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://safestories-app.onrender.com'
  ],
  credentials: true
}));
```

This will automatically allow your Vercel frontend to make API requests.

---

## Step 4: Verify Deployment

### Test Backend:
```bash
curl https://your-backend-name.onrender.com/api/appointments
```

### Test Frontend:
1. Visit: `https://your-app-name.vercel.app`
2. Try logging in
3. Check if data loads from backend

---

## Environment Variables Summary

### Backend (Render):
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://...
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
MINIO_ENDPOINT=s3.fluidjobs.ai
MINIO_PORT=9002
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET_NAME=safestories-panel
FRONTEND_URL=https://your-app-name.vercel.app
```

### Frontend (Vercel):
```env
VITE_API_URL=https://your-backend-name.onrender.com
```

---

## Automatic Deployments

### Vercel:
- **Automatic**: Every push to `main` branch triggers a new deployment
- **Preview**: Pull requests get preview deployments
- **Rollback**: Easy rollback to previous deployments

### Render:
- **Automatic**: Every push to `main` branch triggers a new deployment
- **Manual**: Can trigger manual deploys from dashboard

---

## Custom Domain (Optional)

### For Frontend (Vercel):
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `app.safestories.com`)
3. Update DNS records as instructed
4. SSL certificate is automatic

### For Backend (Render):
1. Go to Service Settings → Custom Domain
2. Add your custom domain (e.g., `api.safestories.com`)
3. Update DNS records as instructed
4. SSL certificate is automatic

### Update Environment Variables:
- **Backend**: `FRONTEND_URL=https://app.safestories.com`
- **Frontend**: `VITE_API_URL=https://api.safestories.com`

---

## Troubleshooting

### Frontend can't connect to backend:
1. Check `VITE_API_URL` is set correctly in Vercel
2. Check CORS is configured in backend
3. Check backend is running on Render
4. Open browser console (F12) to see errors

### CORS errors:
1. Verify `FRONTEND_URL` in backend matches your Vercel URL
2. Redeploy backend after changing CORS settings
3. Check browser console for exact error

### Build fails on Vercel:
1. Check `package.json` has all dependencies
2. Verify `vite.config.ts` is correct
3. Check build logs in Vercel dashboard
4. Ensure Node.js version is compatible (18+)

### Backend build fails on Render:
1. Check TypeScript configuration
2. Verify all dependencies are in `package.json`
3. Check build logs in Render dashboard

---

## Cost Estimate

### Vercel:
- **Hobby Plan**: FREE
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Automatic HTTPS
  - Perfect for this project

### Render:
- **Free Tier**: $0/month (with limitations)
  - Spins down after 15 min inactivity
  - 750 hours/month
- **Starter**: $7/month
  - Always on
  - Better for production

### Total: $0 - $7/month

---

## Monitoring

### Vercel:
- Analytics dashboard
- Real-time logs
- Performance metrics
- Error tracking

### Render:
- Service logs
- Metrics dashboard
- Health checks
- Alerts

---

## Next Steps

1. ✅ Deploy backend on Render (if not done)
2. ✅ Deploy frontend on Vercel
3. ✅ Update CORS settings
4. ✅ Test the application
5. ⬜ Set up custom domains (optional)
6. ⬜ Configure monitoring/alerts
7. ⬜ Set up CI/CD pipelines

---

## Quick Deploy Commands

```bash
# Deploy frontend to Vercel
cd frontend
vercel --prod

# Check backend status
curl https://your-backend-name.onrender.com/api/appointments

# View frontend
open https://your-app-name.vercel.app
```

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Vite Docs**: https://vitejs.dev/guide/

---

## Security Checklist

- ✅ HTTPS enabled (automatic on both platforms)
- ✅ Environment variables secured
- ✅ CORS properly configured
- ✅ Database credentials not in code
- ✅ API keys in environment variables
- ⬜ Rate limiting (add if needed)
- ⬜ Authentication tokens (JWT recommended)

---

**You're ready to deploy! 🚀**
