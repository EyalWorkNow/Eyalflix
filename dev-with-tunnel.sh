#!/bin/bash

# EyalAtiaTV - Development Tunnel Script
# This script starts both the Vite dev server and ngrok tunnel automatically

echo "🚀 Starting EyalAtiaTV Development Environment..."
echo ""

# Start Vite dev server in background
echo "▶️  Starting Vite dev server on port 3000..."
npm run dev &
VITE_PID=$!

# Wait for Vite to be ready
echo "⏳ Waiting for Vite to start..."
sleep 5

# Start ngrok tunnel
echo "🌐 Starting ngrok tunnel..."
echo ""
ngrok http 3000 --log=stdout &
NGROK_PID=$!

# Trap Ctrl+C to cleanup both processes
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill $VITE_PID 2>/dev/null
    kill $NGROK_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

echo ""
echo "✅ READY! Your application is now accessible via:"
echo "   • Local:  http://localhost:3000"
echo "   • Tunnel: Check ngrok output above for your HTTPS URL"
echo ""
echo "   🎬 Use the HTTPS URL to bypass domain restrictions!"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait
