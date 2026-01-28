#!/bin/bash

# Video Proxy + Dev Server Launcher

echo "🚀 Starting EyalAtiaTV with Proxy Bypass..."
echo ""

# Start proxy server
echo "🔧 Starting Video Proxy Server on port 3001..."
cd "$(dirname "$0")"
npm --prefix . install express cors node-fetch 2>/dev/null || true
node proxy-server.js &
PROXY_PID=$!

# Wait for proxy to be ready
sleep 2

# Start Vite dev server
echo "▶️  Starting Vite dev server on port 3000..."
npm run dev &
VITE_PID=$!

# Trap Ctrl+C to cleanup
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill $PROXY_PID 2>/dev/null
    kill $VITE_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

echo ""
echo "✅ READY!"
echo "   • Vite:  http://localhost:3000"
echo "   • Proxy: http://localhost:3001"
echo ""
echo "   🎬 All videos will now bypass domain restrictions via proxy!"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

wait
