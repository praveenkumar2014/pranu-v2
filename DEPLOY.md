# 🚀 PRANU v2 - Deployment Guide

## ✅ Build Status

- **Backend**: ✅ Builds successfully
- **Frontend**: ✅ Builds successfully  
- **Tests**: ✅ Jest configured
- **E2E**: ✅ Playwright installed

---

## 📦 GitHub Setup

### 1. Create GitHub Repository

```bash
# Go to https://github.com/new
# Create repository named: pranu-v2
# DO NOT initialize with README, .gitignore, or license
```

### 2. Push to GitHub

```bash
cd /Users/mac/gensclone/pranu-v2

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/pranu-v2.git

# Push to main branch
git push -u origin main
```

### 3. Verify Push

```bash
# Check remote
git remote -v

# Check status
git status
```

---

## 🌐 Vercel Deployment (Frontend)

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd /Users/mac/gensclone/pranu-v2/frontend
vercel --prod
```

### Option 2: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
   ```
5. Click **Deploy**

---

## 🖥️ Backend Deployment Options

### Option 1: Render (Recommended)

1. Go to https://render.com
2. Create New Web Service
3. Connect GitHub repo
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `pnpm build`
   - **Start Command**: `node dist/index.js`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=4000
     WS_PORT=4001
     JWT_SECRET=your-secret-here
     JWT_EXPIRES_IN=7d
     JWT_REFRESH_SECRET=your-refresh-secret
     JWT_REFRESH_EXPIRES_IN=30d
     GROQ_API_KEY=your-key
     OPENAI_API_KEY=your-key
     ```

### Option 2: Railway

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select `pranu-v2` repo
4. Set root directory to `server`
5. Add environment variables
6. Deploy

### Option 3: VPS (DigitalOcean, AWS, etc.)

```bash
# SSH into server
ssh user@your-server-ip

# Clone repo
git clone https://github.com/YOUR_USERNAME/pranu-v2.git
cd pranu-v2

# Install dependencies
pnpm install

# Build
cd server
pnpm build

# Setup PM2 for process management
npm i -g pm2
pm2 start dist/index.js --name pranu-backend

# Setup nginx as reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/pranu

# Add nginx config:
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/pranu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

## 🔧 Post-Deployment Configuration

### 1. Update Frontend API URL

In Vercel dashboard, set:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

### 2. Update CORS in Backend

Edit `.env` on backend server:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

### 3. Test Deployment

```bash
# Test backend health
curl https://api.yourdomain.com/api/v1/health

# Test frontend
open https://your-frontend.vercel.app
```

---

## 📊 Monitoring

### Backend Logs

```bash
# If using PM2
pm2 logs pranu-backend

# If using Docker
docker logs pranu-backend

# View log files
tail -f server/logs/combined.log
tail -f server/logs/error.log
```

### Frontend Logs

- Vercel Dashboard → Logs
- Browser DevTools → Console

---

## 🔄 Continuous Deployment

### Automatic Deploys

- **Frontend**: Vercel auto-deploys on push to main
- **Backend**: Configure your hosting provider for auto-deploy

### Manual Deploy

```bash
# Frontend
cd frontend
vercel --prod

# Backend (if using PM2)
cd server
git pull
pnpm build
pm2 restart pranu-backend
```

---

## 🎯 Production Checklist

- [ ] Environment variables set
- [ ] CORS configured
- [ ] HTTPS enabled
- [ ] Database path configured
- [ ] JWT secrets set (strong random strings)
- [ ] LLM API keys configured
- [ ] Rate limiting appropriate for production
- [ ] Logging monitored
- [ ] Backups configured
- [ ] Domain names configured
- [ ] SSL certificates active

---

## 📈 Performance Optimization

### Backend

```bash
# Enable clustering (optional)
# Edit server/src/index.ts to use cluster module

# Optimize database
# Consider migrating to PostgreSQL for production
```

### Frontend

```bash
# Vercel handles:
# - CDN distribution
# - Image optimization
# - Code splitting
# - Caching
```

---

## 🆘 Troubleshooting

### Frontend Build Fails

```bash
# Clear cache
cd frontend
rm -rf .next
rm -rf node_modules
pnpm install
pnpm build
```

### Backend Won't Start

```bash
# Check environment variables
cat .env

# Check logs
tail -f logs/error.log

# Rebuild
cd server
rm -rf dist
pnpm build
node dist/index.js
```

### CORS Errors

```bash
# Backend .env must include:
FRONTEND_URL=https://your-frontend-url.com

# Check CORS config in:
server/src/middleware/security.ts
```

---

## 🎉 Success!

Your app is now live at:
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://api.yourdomain.com/api/v1
- **Health Check**: https://api.yourdomain.com/api/v1/health

---

## 📚 Next Steps

1. Monitor logs for errors
2. Set up error tracking (Sentry)
3. Configure analytics
4. Set up automated backups
5. Monitor performance
6. Add custom domain
7. Configure email notifications

---

**Generated**: 2026-04-23
**Version**: 2.0.0
**Status**: Ready for Production
