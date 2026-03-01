#!/bin/bash

# CaneIQ Setup Script
# This script sets up the development environment for CaneIQ

set -e

echo "🎯 Setting up CaneIQ Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup Frontend
echo "🖥️  Setting up frontend..."
cd frontend
npm install
cp .env.local.example .env.local
echo "✅ Frontend setup complete"

# Setup Backend
echo "🔧 Setting up backend..."
cd ../backend
npm install
cp .env.example .env
echo "✅ Backend setup complete"

# Setup Edge Simulation
echo "📹 Setting up edge simulation..."
cd ../edge-simulation
npm install
cp .env.example .env
echo "✅ Edge simulation setup complete"

# Setup AI Module
echo "🤖 Setting up AI module..."
cd ../ai-module
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
echo "✅ AI module setup complete"

# Return to root
cd ..

echo "🎉 CaneIQ setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review and update environment files in each service directory"
echo "2. Start the development servers:"
echo "   npm run dev:frontend  # Frontend on http://localhost:3000"
echo "   npm run dev:backend   # Backend on http://localhost:3001"
echo "   npm run dev:edge      # Edge simulation"
echo "   cd ai-module && python3 main.py  # AI module on http://localhost:5000"
echo ""
echo "🌐 Access the dashboard at: http://localhost:3000"
