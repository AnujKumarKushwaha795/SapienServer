const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const axios = require('axios');

const router = express.Router();
const app = express();

// Add middleware
app.use(cors());
app.use(express.json());
app.use('/.netlify/functions/api', router);

// Simple GET endpoint to test connection
router.get('/', (req, res) => {
    console.log('GET request received');
    res.json({
        message: 'Hello from Netlify Function!',
        timestamp: new Date().toISOString(),
        success: true
    });
});

// Enhanced POST endpoint to handle different actions
router.post('/echo', async (req, res) => {
    console.log('POST request received with data:', req.body);
    
    const { action } = req.body;
    
    switch (action) {
        case 'play_now_clicked':
            try {
                // Step 1: Initial page load to get session/tokens
                const initialResponse = await axios.get('https://game.sapien.io/', {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Connection': 'keep-alive',
                        'Sec-Fetch-Dest': 'document',
                        'Sec-Fetch-Mode': 'navigate',
                        'Sec-Fetch-Site': 'none',
                        'Sec-Fetch-User': '?1',
                        'Upgrade-Insecure-Requests': '1'
                    },
                    maxRedirects: 5,
                    validateStatus: function (status) {
                        return status >= 200 && status < 500; // Accept all responses to analyze them
                    }
                });

                console.log('Initial response status:', initialResponse.status);
                console.log('Initial response headers:', initialResponse.headers);

                // Step 2: Follow any redirects or get game state
                const gameStateResponse = await axios.get('https://game.sapien.io/api/game-state', {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                        'Accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Origin': 'https://game.sapien.io',
                        'Referer': 'https://game.sapien.io/',
                        'Cookie': initialResponse.headers['set-cookie']?.join('; ') || '',
                    }
                });

                // Step 3: Initiate game session
                const playResponse = await axios.post('https://game.sapien.io/api/game/start', {
                    timestamp: new Date().toISOString(),
                    client: 'web',
                    version: '1.0.0'
                }, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                        'Accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Origin': 'https://game.sapien.io',
                        'Referer': 'https://game.sapien.io/',
                        'Content-Type': 'application/json',
                        'Cookie': initialResponse.headers['set-cookie']?.join('; ') || '',
                    }
                });

                res.json({
                    message: 'Game session initiated',
                    success: true,
                    timestamp: new Date().toISOString(),
                    initialStatus: initialResponse.status,
                    gameState: gameStateResponse.data,
                    playResponse: playResponse.data
                });

            } catch (error) {
                console.error('Detailed error:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers
                });
                
                res.status(500).json({
                    message: 'Failed to initiate game session',
                    error: {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status
                    },
                    success: false
                });
            }
            break;
            
        default:
            res.json({
                message: 'Data received successfully',
                receivedData: req.body,
                timestamp: new Date().toISOString(),
                success: true
            });
    }
});

// Endpoint to click Play Now button
router.post('/click-play', async (req, res) => {
    try {
        // Make a GET request to the game URL
        const gameResponse = await axios.get('https://game.sapien.io/play', {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://game.sapien.io/'
            },
            maxRedirects: 5
        });

        res.json({
            success: true,
            message: 'Successfully initiated game play',
            status: gameResponse.status
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Add this new endpoint after other router endpoints and before module.exports
router.get('/health', (req, res) => {
    console.log('Health check request received');
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

router.post('/play-game', async (req, res) => {
    try {
        // Step 1: Get initial page and any tokens
        const pageResponse = await axios.get('https://game.sapien.io/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
            }
        });

        // Extract any necessary tokens from the page
        const html = pageResponse.data;
        // We need to know what tokens/data to extract from the HTML

        // Step 2: Make the actual game initialization request
        // We need the actual endpoint and payload structure
        const gameResponse = await axios.post('https://game.sapien.io/actual-endpoint', {
            // Payload structure needs to be determined
        }, {
            headers: {
                'Origin': 'https://game.sapien.io',
                'Referer': 'https://game.sapien.io/'
            }
        });

        res.json({
            success: true,
            message: 'Game initialization attempted',
            data: gameResponse.data
        });

    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.response?.data
        });
    }
});

// Export the serverless handler
module.exports.handler = serverless(app); 
