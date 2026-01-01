#!/bin/bash
# Deployment Script for time-tracker-pro

echo " Starting Deployment to GitHub..."

# Check Node.js version
echo " Checking Node.js version..."
node --version

# Install dependencies
echo " Installing dependencies..."
npm install

# Build the project
echo " Building project..."
npm run build

# Check build success
if [ -d ".next" ]; then
    echo " Build successful!"
    
    # Create deployment branch
    echo " Creating deployment branch..."
    git checkout -b deployment 2>/dev/null || git checkout deployment
    
    # Add build files
    echo " Adding build files to git..."
    git add .next/ -f
    
    # Commit deployment
    echo " Committing deployment..."
    git commit -m "Deploy build $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Push to GitHub
    echo " Pushing to GitHub..."
    git push origin deployment
    
    echo " Deployment completed!"
    echo " Visit your repository: https://github.com/solomuntesfa/time-tracker-pro"
else
    echo "❌ Build failed! Check errors above."
    exit 1
fi
