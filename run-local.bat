@echo off
echo 🚀 Starting CaneIQ Platform Locally...
echo.

echo 📦 Installing dependencies...
cd /d "%~dp0"
call npm install

echo.
echo 🔧 Setting up backend...
cd backend
call npm install
copy .env.example .env
cd ..

echo.
echo 🖥️ Setting up frontend...
cd frontend
call npm install
copy .env.local.example .env.local
cd ..

echo.
echo 📹 Setting up edge simulation...
cd edge-simulation
call npm install
copy .env.example .env
cd ..

echo.
echo 🤖 Setting up AI module...
cd ai-module
python -m pip install -r requirements.txt
copy .env.example .env
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🎯 To start the platform:
echo    1. Backend:    cd backend && npm run dev
echo    2. AI Module:  cd ai-module && python main.py  
echo    3. Edge Sim:   cd edge-simulation && npm start
echo    4. Frontend:   cd frontend && npm run dev
echo.
echo 🌐 Then visit: http://localhost:3000
echo.
pause
