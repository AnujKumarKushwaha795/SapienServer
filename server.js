const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0 Safari/537.36');

        await page.goto('https://game.sapien.io/', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        await page.waitForSelector('.Hero_cta-button__oTOqM');
        await page.click('.Hero_cta-button__oTOqM');

        await page.waitForNavigation({
            waitUntil: 'networkidle0',
            timeout: 30000
        });

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 