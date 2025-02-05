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
                // Redirect URL for the game dashboard
                const dashboardUrl = 'https://app.sapien.io/t/dashboard';
                
                // First get any necessary cookies/session
                const initialResponse = await axios.get('https://app.sapien.io/', {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9'
                    },
                    maxRedirects: 5,
                    validateStatus: function (status) {
                        return status >= 200 && status < 500;
                    }
                });

                // Then try to access the dashboard
                const dashboardResponse = await axios.get(dashboardUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Referer': 'https://app.sapien.io/',
                        'Cookie': initialResponse.headers['set-cookie']?.join('; ') || ''
                    }
                });

                res.json({
                    success: true,
                    message: 'Navigation attempted',
                    redirectUrl: dashboardUrl,
                    status: dashboardResponse.status,
                    headers: dashboardResponse.headers
                });

            } catch (error) {
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                
                res.status(500).json({
                    success: false,
                    message: 'Failed to navigate to dashboard',
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
