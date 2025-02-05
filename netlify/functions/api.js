const express = require('express');
const { handler: serverlessHandler } = require('@netlify/functions');
const cors = require('cors');

const app = express();

// Add middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}));
app.use(express.json());

// Simple GET endpoint to test connection
app.get('/', (req, res) => {
    console.log('GET request received');
    res.json({
        message: 'Hello from Netlify Function!',
        timestamp: new Date().toISOString(),
        success: true
    });
});

// Simple POST endpoint to echo back data
app.post('/echo', (req, res) => {
    console.log('POST request received with data:', req.body);
    res.json({
        message: 'Data received successfully',
        receivedData: req.body,
        timestamp: new Date().toISOString(),
        success: true
    });
});

// Create handler
const handler = serverlessHandler(app);
module.exports = { handler }; 
