#!/bin/bash

# AudioGuard Live Analysis Startup Script (macOS/Linux)

echo ""
echo "================================================================================"
echo "                   🎙️  AudioGuard - Live Analysis Startup"
echo "================================================================================"
echo ""

# Check if backend is already running
echo "[1/3] Checking backend dependencies..."

cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing dependencies..."
pip install -q -r requirements.txt

echo ""
echo "✅ Backend ready"
echo ""

echo "[2/3] Testing model integration..."
python3 test_live_analysis.py

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Tests failed. Check errors above."
    exit 1
fi

echo ""
echo "[3/3] Starting backend server..."
echo ""
echo "🚀 Backend running on http://localhost:5000"
echo "📡 Check health: http://localhost:5000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 app.py
