
// test page.js
import React, { useState } from 'react';
const TestPage = () => {
    const [status, setStatus] = useState('');

    const handlePlayNow = async () => {
        try {
            setStatus('Clicking...');
            const response = await fetch('https://wootzappanuj.netlify.app/.netlify/functions/api/echo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    action: 'play_now',
                    timestamp: new Date().toISOString()
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                setStatus('Success: ' + data.message);
                console.log('Play Now request successful');
                console.log("data:", data);     
                console.log("response:", response);
                console.log("data.message:", data.message);
                       
            } else {
                setStatus('Error: Request failed');
                console.error('Request failed:', data);
            }
        } catch (error) {
            setStatus(`Error: ${error.message}`);
            console.error('Error:', error);
        }
    };

   return (
        <div style={styles.container}>
            <h1>Test Page</h1>
            <button
                onClick={handlePlayNow}
                style={styles.button}
            >
                Play Now
            </button>
           {status && (
                <p style={styles.status}>
                    {status}
                </p>
            )}
       </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },

    status: {

        marginTop: '10px',

        padding: '10px',

        borderRadius: '5px',

        backgroundColor: '#f5f5f5'

    }

};
export default TestPage; 



// app.js
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
        message: 'Data received successfully from server',
        receivedData: req.body,
        timestamp: new Date().toISOString(),
        success: true
    });
});

// Export the serverless handler
module.exports.handler = serverless(app); 
