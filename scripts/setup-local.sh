#!/bin/bash

# SpeakDirect Local Development Setup Script
# This script sets up the entire platform for local development

set -e

echo "🛠️  SpeakDirect Local Setup"
echo "==========================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js 20 or higher required. You have: $(node -v)"
  echo "Please install Node.js 20+ from https://nodejs.org"
  exit 1
fi
echo "✅ Node.js $(node -v) detected"
echo ""

# Check pnpm
echo "Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm not found. Installing..."
  npm install -g pnpm
fi
echo "✅ pnpm $(pnpm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Setup environment files
echo "📝 Setting up environment files..."

# API .env
if [ ! -f "apps/api/.env" ]; then
  echo "Creating apps/api/.env from .env.example..."
  cp apps/api/.env.example apps/api/.env
  echo "⚠️  IMPORTANT: Edit apps/api/.env with your actual API keys!"
else
  echo "✅ apps/api/.env already exists"
fi

# Web .env.local
if [ ! -f "apps/web/.env.local" ]; then
  echo "Creating apps/web/.env.local from .env.example..."
  cp apps/web/.env.example apps/web/.env.local
  echo "⚠️  IMPORTANT: Edit apps/web/.env.local with your actual API keys!"
else
  echo "✅ apps/web/.env.local already exists"
fi

# Admin .env.local
if [ ! -f "apps/admin/.env.local" ]; then
  echo "Creating apps/admin/.env.local from .env.example..."
  cp apps/admin/.env.example apps/admin/.env.local 2>/dev/null || echo "No .env.example found for admin"
else
  echo "✅ apps/admin/.env.local already exists"
fi

echo ""

# Database setup
echo "🗄️  Database Setup"
echo "=================="
echo ""
echo "Do you want to set up the database now? (y/n)"
read -r setup_db

if [ "$setup_db" = "y" ]; then
  echo ""
  echo "Choose your database option:"
  echo "1. Use local PostgreSQL"
  echo "2. Use Neon (cloud PostgreSQL)"
  echo "3. Skip for now"
  read -r db_choice
  
  case $db_choice in
    1)
      echo ""
      echo "Local PostgreSQL Setup:"
      echo "Please ensure PostgreSQL is installed and running."
      echo ""
      echo "Enter your local PostgreSQL connection string:"
      echo "Format: postgresql://user:password@localhost:5432/speakdirect"
      read -r db_url
      
      # Update .env file
      if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=$db_url|" apps/api/.env
      else
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=$db_url|" apps/api/.env
      fi
      
      echo "✅ DATABASE_URL updated in apps/api/.env"
      ;;
    2)
      echo ""
      echo "Neon Setup:"
      echo "1. Go to https://neon.tech and create an account"
      echo "2. Create a new project"
      echo "3. Copy the connection string"
      echo ""
      echo "Enter your Neon connection string:"
      read -r db_url
      
      # Update .env file
      if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=$db_url|" apps/api/.env
      else
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=$db_url|" apps/api/.env
      fi
      
      echo "✅ DATABASE_URL updated in apps/api/.env"
      ;;
    3)
      echo "Skipping database setup. You can configure it later in apps/api/.env"
      ;;
  esac
  
  # Run migrations
  if [ "$db_choice" = "1" ] || [ "$db_choice" = "2" ]; then
    echo ""
    echo "Running database migrations..."
    cd packages/db
    pnpm prisma:generate
    pnpm prisma:migrate:dev
    cd ../..
    echo "✅ Database migrations complete"
  fi
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📚 Next Steps:"
echo "=============="
echo ""
echo "1. Configure API Keys:"
echo "   - Edit apps/api/.env with your Twilio, Stripe, and other credentials"
echo "   - Edit apps/web/.env.local with your Clerk and API keys"
echo ""
echo "2. Start development servers:"
echo "   pnpm dev"
echo ""
echo "   This will start:"
echo "   - Web app:      http://localhost:2001"
echo "   - Admin panel:  http://localhost:2100"
echo "   - API:          http://localhost:8081"
echo "   - Website:      http://localhost:3001"
echo ""
echo "3. Access the platform:"
echo "   - Open http://localhost:2001 in your browser"
echo "   - Sign up for an account"
echo "   - Start building your AI agents!"
echo ""
echo "📖 Documentation:"
echo "   - README.md              - Platform overview"
echo "   - DEPLOYMENT_GUIDE.md    - Production deployment"
echo "   - PRODUCTION_CHECKLIST.md - Pre-launch checklist"
echo ""
echo "Need help? Check the docs or open an issue on GitHub."
echo ""
