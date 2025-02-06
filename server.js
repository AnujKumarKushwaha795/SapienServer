const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Add middleware
app.use(cors({
    origin: 'http://localhost:3000',  // Keep this as 3000 for React app
    methods: ['GET', 'POST']  // Specify allowed methods
}));
app.use(express.json());

// Add a root route
app.get('/anuj', (req, res) => {
    res.send('Anuj: Server is running!');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Button click endpoint
app.post('/click-play', async (req, res) => {
    let browser;
    try {
        // Launch browser with required args for Render.com
        browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--single-process'
            ],
            headless: 'new'
        });

        const page = await browser.newPage();

        // Set viewport and user agent
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0 Safari/537.36');

        // Navigate to Sapien
        await page.goto('https://game.sapien.io/', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for and click the button
        await page.waitForSelector('.Hero_cta-button__oTOqM');
        await page.click('.Hero_cta-button__oTOqM');

        // Wait for navigation
        await page.waitForNavigation({
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Get final URL
        const finalUrl = page.url();

        res.json({
            success: true,
            message: 'Button clicked successfully',
            result: {
                finalUrl,
                expectedUrl: 'https://app.sapien.io/t/dashboard'
            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to click button',
            error: error.message
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something broke!'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Build logs:         https://app.netlify.com/sites/wootzappanuj/deploys
// Function logs:      https://app.netlify.com/sites/wootzappanuj/logs/functions
// Edge function Logs: https://app.netlify.com/sites/wootzappanuj/logs/edge-functions
// Website URL:        https://wootzappanuj.netlify.app