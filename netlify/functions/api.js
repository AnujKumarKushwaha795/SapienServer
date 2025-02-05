const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const playwright = require('playwright-core');

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
                // Launch browser
                const browser = await playwright.chromium.launch({
                    headless: true
                });

                // Create new context and page
                const context = await browser.newContext();
                const page = await context.newPage();
                
                // Navigate to Sapien
                await page.goto('https://game.sapien.io/');

                // Wait for button and click it
                const button = await page.waitForSelector('.Hero_cta-button__oTOqM');
                await button.click();

                // Wait for navigation
                await page.waitForURL('https://app.sapien.io/t/dashboard', { timeout: 10000 });

                // Get final URL
                const finalUrl = page.url();

                // Close browser
                await browser.close();

                res.json({
                    success: true,
                    message: 'Button clicked successfully',
                    navigationResult: {
                        finalUrl,
                        expectedUrl: 'https://app.sapien.io/t/dashboard',
                        buttonClicked: true
                    }
                });

            } catch (error) {
                console.error('Error details:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to click button',
                    error: {
                        message: error.message,
                        stack: error.stack
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
