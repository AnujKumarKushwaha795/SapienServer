const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Add middleware
app.use(cors({
    origin: 'http://localhost:3000',  // Keep this as 3000 for React app
    methods: ['GET', 'POST']  // Specify allowed methods
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});