@echo off
echo 🚀 Starting CaneIQ Services...
echo.

echo 🔧 Starting Backend...
start "CaneIQ Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo 🤖 Starting AI Module...
start "CaneIQ AI Module" cmd /k "cd ai-module && python main.py"

timeout /t 3 /nobreak >nul

echo 📹 Starting Edge Simulation...
start "CaneIQ Edge Simulation" cmd /k "cd edge-simulation && npm start"

timeout /t 2 /nobreak >nul

echo 🖥️ Starting Frontend...
start "CaneIQ Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ All services starting...
echo.
echo 🌐 Dashboard will be available at: http://localhost:3000
echo 🔧 Backend API: http://localhost:3001
echo 🤖 AI Module: http://localhost:5000
echo.
echo 💡 Close this window and the service windows to stop all services
echo.
pause
