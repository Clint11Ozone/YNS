// app.js

const express = require('express');
const bodyParser = require('body-parser');
const { handleWebhook } = require('./webhook');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.post('/webhook', handleWebhook);

// Error handling for webhook not received
let webhookReceived = false;
// setInterval(() => {
//     if (!webhookReceived) {
//         console.log('Webhook not received');
//     }
//     webhookReceived = false;
// }, 10000);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
<<<<<<< HEAD


=======
>>>>>>> fc78724099dbbffad53da5543a7ac8498bea90d2
