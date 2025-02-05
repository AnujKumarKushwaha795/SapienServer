// Replace this URL with your actual Netlify URL
const API_BASE_URL = 'https://wootzappanuj.netlify.app/.netlify/functions/api';

// Function to call the API
async function callServer() {
    try {
        const response = await fetch(`${API_BASE_URL}/play-now`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ /* your data here */ })
        });
        
        const data = await response.json();
        console.log('Server response:', data);
        
    } catch (error) {
        console.error('Error calling server:', error);
    }
} 
callServer();

// echo "# SapienServer" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/AnujKumarKushwaha795/SapienServer.git

// git push -u origin main

// Function to simulate clicking the Play Now button
async function clickPlayNowButton() {
    // Find the button using its class
    const playButton = document.querySelector('.Hero_cta-button__oTOqM');
    
    if (playButton) {
        // Simulate a click event
        playButton.click();
        return true;
    } else {
        throw new Error('Play Now button not found');
    }
}

// Export the function
module.exports = {
    clickPlayNowButton
};