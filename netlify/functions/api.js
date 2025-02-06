const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

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
                // Return instructions for client-side execution
                res.json({
                    success: true,
                    message: 'Click instructions sent',
                    action: {
                        type: 'click',
                        selector: '.Hero_cta-button__oTOqM',
                        expectedUrl: 'https://app.sapien.io/t/dashboard'
                    }
                });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to process request',
                    error: error.message
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
