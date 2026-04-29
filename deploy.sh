#!/bin/bash

# ============================================================
# PRANU v2 - Quick Deploy Script
# ============================================================

echo "🚀 PRANU v2 Deployment Helper"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from pranu-v2 root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Current Status:${NC}"
echo "Branch: $(git branch --show-current)"
echo "Commits: $(git rev-list --count HEAD)"
echo "Files: $(git ls-files | wc -l | tr -d ' ')"
echo ""

# Step 1: GitHub
echo -e "${GREEN}Step 1: Push to GitHub${NC}"
echo "Have you created a GitHub repository yet?"
read -p "Enter your GitHub username: " GITHUB_USER
echo ""

REPO_URL="https://github.com/${GITHUB_USER}/pranu-v2.git"

echo "Repository URL: $REPO_URL"
read -p "Is this correct? (y/n): " CONFIRM

if [ "$CONFIRM" = "y" ]; then
    echo ""
    echo "📤 Pushing to GitHub..."
    
    # Add remote if not exists
    if ! git remote | grep -q origin; then
        git remote add origin $REPO_URL
    fi
    
    # Push
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
        echo "📎 URL: https://github.com/${GITHUB_USER}/pranu-v2"
    else
        echo -e "${RED}❌ Push failed. Please check the error above.${NC}"
        exit 1
    fi
else
    echo "Please update the script with correct username and run again."
    exit 0
fi

echo ""

# Step 2: Vercel Frontend
echo -e "${GREEN}Step 2: Deploy Frontend to Vercel${NC}"
echo ""
echo "This will install Vercel CLI and deploy the frontend."
read -p "Continue? (y/n): " DEPLOY_FRONTEND

if [ "$DEPLOY_FRONTEND" = "y" ]; then
    echo ""
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
    
    echo ""
    echo "🚀 Deploying frontend to Vercel..."
    cd frontend
    
    # Deploy
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend deployed to Vercel!${NC}"
    else
        echo -e "${RED}❌ Vercel deployment failed.${NC}"
        echo "Try manual deployment: cd frontend && npx vercel --prod"
    fi
    
    cd ..
else
    echo ""
    echo "To deploy manually:"
    echo "  cd frontend"
    echo "  npx vercel --prod"
    echo ""
    echo "OR use Vercel dashboard:"
    echo "  1. Go to https://vercel.com/new"
    echo "  2. Import your GitHub repo"
    echo "  3. Set root directory to: frontend"
    echo "  4. Click Deploy"
fi

echo ""

# Step 3: Backend Deployment
echo -e "${GREEN}Step 3: Deploy Backend${NC}"
echo ""
echo "Choose your backend hosting:"
echo "  1. Render.com (Recommended)"
echo "  2. Railway.app"
echo "  3. Skip (deploy later)"
read -p "Choice (1/2/3): " BACKEND_CHOICE

case $BACKEND_CHOICE in
    1)
        echo ""
        echo "📋 Render Deployment Steps:"
        echo "  1. Go to https://render.com"
        echo "  2. Create New Web Service"
        echo "  3. Connect your GitHub repo"
        echo "  4. Configure:"
        echo "     - Root Directory: server"
        echo "     - Build Command: pnpm build"
        echo "     - Start Command: node dist/index.js"
        echo "  5. Add environment variables (see DEPLOY.md)"
        echo "  6. Click Deploy!"
        ;;
    2)
        echo ""
        echo "📋 Railway Deployment Steps:"
        echo "  1. Go to https://railway.app"
        echo "  2. New Project → Deploy from GitHub"
        echo "  3. Select pranu-v2 repo"
        echo "  4. Set root directory to: server"
        echo "  5. Add environment variables"
        echo "  6. Deploy!"
        ;;
    3)
        echo ""
        echo "You can deploy the backend later."
        echo "See DEPLOY.md for detailed instructions."
        ;;
    *)
        echo "Invalid choice. See DEPLOY.md for instructions."
        ;;
esac

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Deployment Guide Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "📚 Next Steps:"
echo "  1. Check DEPLOY.md for detailed instructions"
echo "  2. Check PROJECT_COMPLETE.md for full summary"
echo "  3. Set up environment variables"
echo "  4. Test your deployment"
echo ""
echo "🎉 Good luck with your deployment!"
