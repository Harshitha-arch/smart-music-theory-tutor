#!/bin/bash

echo "🎵 Setting up Smart Music Theory Tutor..."
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p database
mkdir -p server/public/audio
mkdir -p client/build

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file and add your OpenAI API key!"
fi

# Build client
echo "🔨 Building client..."
cd client && npm run build && cd ..

echo ""
echo "🎉 Setup complete!"
echo "=================="
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "To run in production:"
echo "  npm start"
echo ""
echo "To use Docker:"
echo "  docker-compose up --build"
echo ""
echo "⚠️  Don't forget to:"
echo "  1. Add your OpenAI API key to .env file"
echo "  2. Configure any additional settings in .env"
echo ""
echo "🌐 The app will be available at: http://localhost:5000" 