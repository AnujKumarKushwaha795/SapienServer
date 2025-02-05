// Replace this URL with your actual Netlify URL
const API_BASE_URL = 'https://your-site-name.netlify.app/.netlify/functions/api';

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