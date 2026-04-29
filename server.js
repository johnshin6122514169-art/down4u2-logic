const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Allows your HTML file to talk to this server

app.get('/check', async (req, res) => {
    let targetUrl = req.query.url;
    
    // Simple sanitization to ensure it has a protocol
    if (!targetUrl.startsWith('http')) {
        targetUrl = `https://${targetUrl}`;
    }

    try {
        // We attempt a HEAD request (faster than GET as it doesn't download the whole page)
        const response = await axios.head(targetUrl, { timeout: 5000 });
        
        if (response.status >= 200 && response.status < 400) {
            res.json({ status: 'up' });
        } else {
            res.json({ status: 'down' });
        }
    } catch (error) {
        // If the request fails (404, 500, or DNS error), the site is likely "down"
        res.json({ status: 'down' });
    }
});

app.listen(3000, () => console.log('Checker logic running on port 3000'));
