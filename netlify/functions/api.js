const express = require('express');
const { handler: serverlessHandler } = require('@netlify/functions');
const cors = require('cors');

const app = express();

// Add middleware
app.use(cors({
    origin: [
        '*',
        // 'chrome-extension://your-extension-id',
        // 'moz-extension://your-extension-id'
    ],

    methods: ['GET', 'POST']
}));
app.use(express.json());

// Add a root route
app.get('/', (req, res) => {
    console.log('GET request received at /', {
        timestamp: new Date().toISOString(),
        headers: req.headers,
        query: req.query
    });
    
    return res.json({
        Message:'Anuj: Server is running!',
        timestamp: new Date().toISOString(),
        status: 'success',
        data: {
            message: 'Server is running!'
        }         
    });
});


// Route to handle "Play Now" button click
app.post('/play-now', (req, res) => {
    try {
        console.log('POST request received at /play-now', {
            timestamp: new Date().toISOString(),
            body: req.body,
            headers: req.headers
        });
        
        res.json({ 
            success: true, 
            message: 'Play Now button clicked successfully! on server',
            timestamp: new Date().toISOString(),
            receivedData: req.body
        });
    } catch (error) {
        console.error('Error in /play-now route:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message
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

// Create handler
const handler = serverlessHandler(app);
module.exports = { handler }; 
