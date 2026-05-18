@echo off
REM AudioGuard Live Analysis Startup Script

echo.
echo ================================================================================
echo                   🎙️  AudioGuard - Live Analysis Startup
echo ================================================================================
echo.

REM Check if backend is already running
echo [1/3] Checking backend dependencies...

cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -q -r requirements.txt

echo.
echo ✅ Backend ready
echo.

echo [2/3] Testing model integration...
python test_live_analysis.py

if %errorlevel% neq 0 (
    echo.
    echo ❌ Tests failed. Check errors above.
    pause
    exit /b 1
)

echo.
echo [3/3] Starting backend server...
echo.
echo 🚀 Backend running on http://localhost:5000
echo 📡 Check health: http://localhost:5000/health
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py
