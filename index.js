const express = require('express');
const bodyParser = require('body-parser');
const { handleWebhook } = require('./webhook');
const { generateQRCode } = require('./whatsapp'); // Import the generateQRCode function

const https = require('https'); // Changed from 'http' to 'https'

// URL of your server - Make sure it's an HTTPS URL
const serverUrl = 'https://yns23.onrender.com';

function pingServer() {
    https.get(serverUrl, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
}

// Set interval to ping the server every 30 seconds
setInterval(pingServer, 30000); // 30000 milliseconds


const app = express();
const port = process.env.PORT || 3003;

app.use(bodyParser.json());

let lastQRCodeGeneration = 0; // Keep track of the last time a QR code was generated

// Serve the HTML file with the QR code image
app.get('/', async (req, res) => {
    const now = Date.now();
    const timeElapsed = now - lastQRCodeGeneration;
    const waitTime = 0.5 * 60 * 1000; // 2 minutes in milliseconds

    if (timeElapsed >= waitTime) {
        try {
            // Generate QR code
            const qrDataUrl = await generateQRCode();
            lastQRCodeGeneration = now; // Update the last QR code generation time

            // Render HTML page with QR code
            res.send(`
                <html>
                    <head>
                        <title>WhatsApp QR Code</title>
                        <style>
                            body { display: flex; justify-content: center; align-items: center; height: 100vh; }
                        </style>
                    </head>
                    <body>
                        <img src="${qrDataUrl}" alt="WhatsApp QR Code" style="max-width: 100%; height: auto; display: block;">
                    </body>
                </html>
            `);
        } catch (error) {
            console.error('Error generating QR code:', error);
            res.status(500).send('Internal server error');
        }
    } else {
        // Render a countdown timer
        const remainingTime = waitTime - timeElapsed;

        res.send(`
            <html>
                <head>
                    <title>Wait for New QR Code</title>
                    <style>
                        body { display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif; }
                        #timer { font-size: 24px; }
                    </style>
                    <script>
                        function startTimer(duration, display) {
                            var timer = duration, minutes, seconds;
                            setInterval(function () {
                                minutes = parseInt(timer / 60, 10);
                                seconds = parseInt(timer % 60, 10);

                                minutes = minutes < 10 ? "0" + minutes : minutes;
                                seconds = seconds < 10 ? "0" + seconds : seconds;

                                display.textContent = minutes + ":" + seconds;

                                if (--timer < 0) {
                                    timer = 0;
                                    window.location.reload(); // Reload the page after the timer expires
                                }
                            }, 1000);
                        }

                        window.onload = function () {
                            var twoMinutes = ${remainingTime / 1000};
                            var display = document.querySelector('#timer');
                            startTimer(twoMinutes, display);
                        };
                    </script>
                </head>
                <body>
                    <div>Please wait for the next QR code generation.</div>
                    <div id="timer"></div>
                </body>
            </html>
        `);
    }
});

// Handle webhook
app.post('/webhook', handleWebhook);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
