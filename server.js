const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000; // or any other port you prefer

// Middleware to parse JSON
app.use(express.json());

// Endpoint to get email data
app.get('/api/emails', (req, res) => {
    const filePath = path.join(__dirname, 'email.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading file' });
        }
        // Send JSON data back to the frontend
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
