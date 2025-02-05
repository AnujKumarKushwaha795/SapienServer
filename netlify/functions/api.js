const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

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
                const browser = await puppeteer.launch({
                    args: chromium.args,
                    defaultViewport: chromium.defaultViewport,
                    executablePath: await chromium.executablePath,
                    headless: true,
                });

                // Create new page
                const page = await browser.newPage();
                
                // Navigate to Sapien
                await page.goto('https://game.sapien.io/', {
                    waitUntil: 'networkidle0',
                });

                // Wait for button to be visible
                await page.waitForSelector('.Hero_cta-button__oTOqM');

                // Click the button
                await page.click('.Hero_cta-button__oTOqM');

                // Wait for navigation
                await page.waitForNavigation({
                    waitUntil: 'networkidle0',
                });

                // Get current URL
                const currentUrl = page.url();

                // Close browser
                await browser.close();

                res.json({
                    success: true,
                    message: 'Button clicked successfully',
                    navigationResult: {
                        finalUrl: currentUrl,
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
