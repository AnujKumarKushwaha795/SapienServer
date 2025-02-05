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
                // Step 1: Get the initial page and any necessary tokens/cookies
                const initialResponse = await fetch('https://game.sapien.io/', {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });

                // Get any cookies from the response
                const cookies = initialResponse.headers.get('set-cookie');

                // Step 2: Replicate the Play Now button click request
                // We'll need to fill in these details based on the analysis
                const clickResponse = await fetch('https://game.sapien.io/api/play', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': cookies,
                        'Origin': 'https://game.sapien.io',
                        'Referer': 'https://game.sapien.io/'
                    },
                    body: JSON.stringify({
                        // Add any required data based on analysis
                        timestamp: new Date().toISOString()
                    })
                });

                const data = await clickResponse.json();
                
                res.json({
                    message: 'Attempted to trigger Play Now action',
                    success: true,
                    timestamp: new Date().toISOString(),
                    responseData: data
                });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({
                    message: 'Failed to trigger Play Now action',
                    error: error.message,
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

// Export the serverless handler
module.exports.handler = serverless(app); 
