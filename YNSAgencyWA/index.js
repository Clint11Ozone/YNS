const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Flag to track if webhook is received
let webhookReceived = false;

// Endpoint to receive webhook events
app.post('/webhook', (req, res) => {
    // Set the flag to true upon receiving the webhook
    webhookReceived = true;

    // Assuming the webhook payload is JSON
    const payload = req.body;

    // Process the payload here
    console.log('Received webhook payload:', payload);

    // Respond to the webhook event
    res.status(200).send('Webhook received successfully');
});

// Error handling to log "not received" if webhook isn't received every 10 seconds
setInterval(() => {
    if (!webhookReceived) {
        console.log('Webhook not received');
    }
    // Reset the flag for the next interval
    webhookReceived = false;
}, 10000);

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
