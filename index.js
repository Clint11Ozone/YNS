const express = require('express');
const bodyParser = require('body-parser');
const { handleWebhook } = require('./webhook');
const { generateQRCode } = require('./whatsapp'); // Import the generateQRCode function

const app = express();
const port = process.env.PORT || 3003;

app.use(bodyParser.json());

let lastQRCodeGeneration = 0; // Keep track of the last time a QR code was generated

// Serve the HTML file with the QR code image
app.get('/', async (req, res) => {
    try {
        // Check if 5 minutes have passed since the last QR code generation
        const now = Date.now();
        if (now - lastQRCodeGeneration >= 5 * 60 * 1000) {
            // Generate QR code
            const qrDataUrl = await generateQRCode();
            lastQRCodeGeneration = now; // Update the last QR code generation time

            // Render HTML page with QR code
            res.send(`
                <html>
                    <head>
                        <title>WhatsApp QR Code</title>
                    </head>
                    <body>
                        <img src="${qrDataUrl}" alt="WhatsApp QR Code">
                    </body>
                </html>
            `);
        } else {
            // If 5 minutes have not passed, return a message
            res.send('Please wait 5 minutes before requesting a new QR code.');
        }
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Internal server error');
    }
});

// Handle webhook
app.post('/webhook', handleWebhook);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});