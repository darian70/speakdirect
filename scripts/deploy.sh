#!/bin/bash

# SpeakDirect Deployment Script
# This script helps deploy the platform to production

set -e

echo "🚀 SpeakDirect Deployment Script"
echo "================================="
echo ""

# Check if environment is specified
if [ "$1" != "api" ] && [ "$1" != "web" ] && [ "$1" != "admin" ] && [ "$1" != "all" ]; then
  echo "Usage: ./scripts/deploy.sh [api|web|admin|all]"
  echo ""
  echo "Examples:"
  echo "  ./scripts/deploy.sh api    # Deploy API to Render"
  echo "  ./scripts/deploy.sh web    # Deploy Web App to Vercel"
  echo "  ./scripts/deploy.sh admin  # Deploy Admin Panel to Vercel"
  echo "  ./scripts/deploy.sh all    # Deploy everything"
  exit 1
fi

TARGET=$1

# Function to deploy API
deploy_api() {
  echo "📦 Deploying API to Render..."
  echo ""
  echo "Steps:"
  echo "1. Push code to GitHub main branch"
  echo "2. Render will auto-deploy (if configured)"
  echo "3. Or manually trigger deploy in Render dashboard"
  echo ""
  
  # Check if on main branch
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  if [ "$BRANCH" != "main" ]; then
    echo "⚠️  You are on branch '$BRANCH', not 'main'"
    echo "Switch to main? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
      git checkout main
      git pull origin main
    else
      echo "Aborted."
      exit 1
    fi
  fi
  
  echo "Pushing to origin main..."
  git push origin main
  
  echo "✅ Code pushed! Check Render dashboard for deployment status:"
  echo "   https://dashboard.render.com"
}

# Function to deploy web app
deploy_web() {
  echo "🌐 Deploying Web App to Vercel..."
  cd apps/web
  
  # Check if Vercel CLI is installed
  if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
  fi
  
  echo "Running production deployment..."
  vercel --prod
  
  echo "✅ Web app deployed!"
  cd ../..
}

# Function to deploy admin panel
deploy_admin() {
  echo "👨‍💼 Deploying Admin Panel to Vercel..."
  cd apps/admin
  
  # Check if Vercel CLI is installed
  if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
  fi
  
  echo "Running production deployment..."
  vercel --prod
  
  echo "✅ Admin panel deployed!"
  cd ../..
}

# Execute deployments based on target
case $TARGET in
  api)
    deploy_api
    ;;
  web)
    deploy_web
    ;;
  admin)
    deploy_admin
    ;;
  all)
    deploy_api
    echo ""
    deploy_web
    echo ""
    deploy_admin
    ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Verify deployments in their respective dashboards"
echo "2. Test critical user flows (sign up, create agent, make call)"
echo "3. Monitor error logs for any issues"
echo "4. Check webhook configurations are working"
echo ""
