const express = require('express');
const serverless = require('@netlify/functions');
const cors = require('cors');

const app = express();

// Add middleware
app.use(cors({
    origin: [
        'chrome-extension://your-extension-id',
        'moz-extension://your-extension-id'
    ],
    methods: ['GET', 'POST']
}));
app.use(express.json());

// Add a root route
app.get('/', (req, res) => {
    res.send('Anuj: Server is running!');
});

// Route to handle "Play Now" button click
app.post('/play-now', (req, res) => {
    try {
        console.log('Play Now button clicked!');
        res.json({ 
            success: true, 
            message: 'Play Now button clicked successfully! on server',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in /play-now route:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error'
        });
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

const handler = serverless.handler(app);
module.exports = { handler }; 