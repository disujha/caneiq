#!/bin/bash

# CaneIQ Development Start Script
# This script starts all development services

set -e

echo "🚀 Starting CaneIQ Development Environment..."

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $1 is already in use"
        return 1
    fi
    return 0
}

# Check ports
if ! check_port 3000; then
    echo "❌ Frontend port 3000 is busy"
    exit 1
fi

if ! check_port 3001; then
    echo "❌ Backend port 3001 is busy"
    exit 1
fi

if ! check_port 5000; then
    echo "❌ AI Module port 5000 is busy"
    exit 1
fi

echo "✅ Port checks passed"

# Start Backend
echo "🔧 Starting backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start AI Module
echo "🤖 Starting AI module..."
cd ai-module
source venv/bin/activate
python3 main.py &
AI_PID=$!
cd ..

# Wait for AI module to start
sleep 3

# Start Edge Simulation
echo "📹 Starting edge simulation..."
cd edge-simulation
npm start &
EDGE_PID=$!
cd ..

# Wait for edge simulation to start
sleep 2

# Start Frontend
echo "🖥️  Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 All services started!"
echo ""
echo "📊 Services running:"
echo "   Frontend:     http://localhost:3000 (PID: $FRONTEND_PID)"
echo "   Backend:      http://localhost:3001 (PID: $BACKEND_PID)"
echo "   AI Module:    http://localhost:5000 (PID: $AI_PID)"
echo "   Edge Sim:     Running (PID: $EDGE_PID)"
echo ""
echo "🔍 Health checks:"
echo "   Frontend:     http://localhost:3000"
echo "   Backend:      http://localhost:3001/health"
echo "   AI Module:    http://localhost:5000/health"
echo ""
echo "🛑 To stop all services, run: ./scripts/stop-dev.sh"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $FRONTEND_PID $BACKEND_PID $AI_PID $EDGE_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Trap signals
trap cleanup SIGINT SIGTERM

# Wait for services
wait
