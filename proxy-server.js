import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Enable CORS for your frontend
app.use(cors({
    origin: '*', // In production, restrict to your domain
    credentials: true
}));

/**
 * Video Proxy Endpoint
 * This bypasses domain restrictions by fetching the video server-side
 * 
 * Usage: /api/proxy?url=<encoded_video_url>
 */
app.get('/api/proxy', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'Missing URL parameter' });
        }

        const decodedUrl = decodeURIComponent(url);
        console.log(`🎬 Proxying video from: ${decodedUrl}`);

        // Fetch with headers that mimic a real browser
        const response = await fetch(decodedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://aniplus.co/',
                'Origin': 'https://aniplus.co',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        if (!response.ok) {
            console.error(`❌ Upstream error: ${response.status}`);
            return res.status(response.status).json({
                error: `Upstream server returned ${response.status}`
            });
        }

        // Forward all headers from the upstream response
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');

        res.setHeader('Content-Type', contentType || 'video/mp4');
        if (contentLength) {
            res.setHeader('Content-Length', contentLength);
        }

        // Enable range requests for video seeking
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Access-Control-Allow-Origin', '*');

        console.log(`✅ Streaming video (${contentType}, ${contentLength} bytes)`);

        // Stream the response
        response.body.pipe(res);

    } catch (error) {
        console.error('❌ Proxy error:', error);
        res.status(500).json({
            error: 'Failed to proxy video',
            details: error.message
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Video Proxy Server' });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Video Proxy Server running on http://localhost:${PORT}`);
    console.log(`📡 Proxy endpoint: http://localhost:${PORT}/api/proxy?url=<encoded_url>\n`);
});
