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

// Simple POST endpoint to echo back data
router.post('/echo', (req, res) => {
    console.log('POST request received with data:', req.body);
    res.json({
        message: 'Data received successfully',
        receivedData: req.body,
        timestamp: new Date().toISOString(),
        success: true
    });
});

// Export the serverless handler
module.exports.handler = serverless(app); 
