const { Client, NoAuth } = require("whatsapp-web.js");
const qrcode = require('qrcode');
const { getConversationState, setConversationState } = require('./conversationState');
const { handleWebhook } = require('./webhook');

const client = new Client({ authStrategy: new NoAuth() });

async function generateQRCode() {
    return new Promise((resolve, reject) => {
        client.on('qr', (qr) => {
            qrcode.toDataURL(qr, (err, url) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(url);
                }
            });
        });

        client.initialize();
    });
}

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
});

async function sendMessage(phoneNumber, message, firstName='') {
    try {
        phoneNumber = phoneNumber.replace('+', ''); // Remove '+' if present
        const whatsappNumber = phoneNumber + "@c.us";
        await client.sendMessage(whatsappNumber, message);
        console.log(`Message sent to ${whatsappNumber}`);
    } catch (error) {
        console.error(`Failed to send message to ${phoneNumber}`, error);
    }
}

client.on('message', async msg => {
    if (msg.body.toLowerCase() === 'start') {
        const userId = msg.from;
        setConversationState(userId, { stage: 'question1' });
        client.sendMessage(userId, `${firstName} To help you find your perfect home, we'd love to know more about what you like. This will help us tailor the search just for you:`);
    } else {
        const userId = msg.from;
        const state = getConversationState(userId);

        switch (state.stage) {
            case 'question1':
                setConversationState(userId, { stage: 'question2' });
                client.sendMessage(userId, `📍Location: What's your ideal area or neighborhood?`);
                break;
            case 'question2':
                setConversationState(userId, { stage: 'question3' });
                client.sendMessage(userId, `🏠 What is your style: What style of home are you drawn to? (modern, traditional, loft)`);
                break;
            case 'question3':
                // End of conversation
                setConversationState(userId, { stage: 'question4' });
                client.sendMessage(userId, `🤩 Extras: What do your prefer (e.g., balcony, pet-friendly)`);
                break;
            case 'question4':
                // End of conversation
                setConversationState(userId, { stage: 'question5' });
                client.sendMessage(userId, `🎉 Congratulations! We're thrilled to help you find the perfect home. We'll be in touch with some listings soon.`);
                break;
            case 'question5':
                // End of conversation
                setConversationState(userId, { stage: 'question6' });
                client.sendMessage(userId, `📈 Speed up the process! Upload your documents now for priority assistance and get listings faster. [LINK] 
                ✅ Type 'done' after uploading.  
                😕 Prefer not to? Type 'listings'.`);
                break;
            default:
                // Optional: handle unexpected messages or reset the conversation
                break;
        }
    }
});

module.exports = { sendMessage, generateQRCode };
