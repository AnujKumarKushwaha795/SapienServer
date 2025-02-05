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
                // First get the main page to find the button
                const mainPageResponse = await axios.get('https://game.sapien.io/', {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    }
                });

                // Simulate clicking the actual button
                const clickResponse = await axios.post('https://game.sapien.io/', {
                    buttonSelector: 'Hero_cta-button__oTOqM',
                    action: 'click',
                    elementData: {
                        class: 'Hero_cta-button__oTOqM primary ResponsiveButton_button__Zvkip ResponsiveButton_primary__Ndytn',
                        text: 'Play Now!'
                    }
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Referer': 'https://game.sapien.io/',
                        'Origin': 'https://game.sapien.io'
                    }
                });

                res.json({
                    success: true,
                    message: 'Button click attempted',
                    buttonInfo: {
                        class: 'Hero_cta-button__oTOqM',
                        text: 'Play Now!'
                    },
                    response: clickResponse.data
                });

            } catch (error) {
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                
                res.status(500).json({
                    success: false,
                    message: 'Failed to click button',
                    error: {
                        message: error.message,
                        status: error.response?.status,
                        data: error.response?.data
                    }
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

// Add this new endpoint after other router endpoints and before module.exports
router.get('/health', (req, res) => {
    console.log('Health check request received');
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

module.exports.handler = serverless(app); 
