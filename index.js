const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module
const { handleWebhook } = require('./webhook');
const { generateQRCode } = require('./whatsapp'); // Import the generateQRCode function

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve the HTML file with the QR code image
app.get('/', async (req, res) => {

      
    try {
        // Generate QR code
        const qrDataUrl = await generateQRCode();
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
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Internal server error');
    }
});

// Handle webhook
app.post('/webhook', handleWebhook);

// Error handling for webhook not received
let webhookReceived = false;
// setInterval(() => {
// if (!webhookReceived) {
// console.log('Webhook not received');
// }
// webhookReceived = false;
// }, 10000);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
