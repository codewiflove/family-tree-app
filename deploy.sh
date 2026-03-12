#!/bin/bash

# Deployment script for Salasilah Keluarga App

echo "🚀 Starting deployment of Salasilah Keluarga App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check npm version
echo "📦 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🏗️  Building the app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📁 Build files are in the 'dist' directory."
    echo ""
    echo "🌐 Deployment Options:"
    echo "1. Deploy to Vercel:"
    echo "   - Push code to GitHub"
    echo "   - Go to vercel.com and import repository"
    echo ""
    echo "2. Deploy to Netlify:"
    echo "   - Push code to GitHub"
    echo "   - Go to netlify.com and deploy from Git"
    echo ""
    echo "3. Deploy to GitHub Pages:"
    echo "   - Update vite.config.js with base URL"
    echo "   - Run: npm run deploy"
    echo ""
    echo "4. Manual deployment:"
    echo "   - Copy contents of 'dist' folder to your web server"
    echo ""
    echo "🔧 Development server:"
    echo "   Run: npm run dev"
    echo "   Open: http://localhost:5173"
else
    echo "❌ Build failed. Please check for errors."
    exit 1
fi