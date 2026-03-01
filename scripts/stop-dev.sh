#!/bin/bash

# CaneIQ Development Stop Script
# This script stops all development services

echo "🛑 Stopping CaneIQ Development Environment..."

# Find and kill processes on common ports
echo "🔍 Finding running services..."

# Kill processes on ports 3000, 3001, 5000
for port in 3000 3001 5000; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "🛑 Stopping service on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
    fi
done

# Kill any remaining node processes related to caneiq
echo "🧹 Cleaning up remaining processes..."
pkill -f "caneiq" 2>/dev/null || true
pkill -f "edge-simulation" 2>/dev/null || true
pkill -f "ai-module" 2>/dev/null || true

echo "✅ All services stopped successfully!"
