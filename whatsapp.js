const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const { getConversationState, setConversationState } = require("./conversationState");

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "sessions" }),
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
  }
});

function initializeWhatsAppClient() {
  client.initialize().catch(err => {
    console.error('Failed to initialize the client:', err);
  });
}


client.setMaxListeners(130);
client.initialize();

let qrDataUrl = null; // Initialize the variable to store the QR code data URL
let qrListeners = 0; // Keep track of the number of QR code listeners


function generateQRCode() {
  return new Promise((resolve, reject) => {
    if (qrDataUrl) {
      resolve(qrDataUrl);
    } else {
      const qrListener = (qr) => {
        qrcode.toDataURL(qr, (err, url) => {
          if (err) {
            reject(err);
          } else {
            qrDataUrl = url;
            client.removeListener("qr", qrListener); // Remove the listener after generating the QR code
            resolve(url);
          }
        });
      };

      if (qrListeners < 100) {
        client.once("qr", qrListener);
        qrListeners++;
      } else {
        console.error("Maximum number of QR code listeners reached. Cannot generate more QR codes.");
        reject(new Error("Maximum number of QR code listeners reached"));
      }
    }
  });
}



client.once("ready", () => {
  console.log("WhatsApp Client is ready for connection!");
  if (typeof window !== 'undefined') {
    // This will work only if this script is run in a browser environment where 'window' is defined
    const event = new Event('whatsappConnected');
    window.dispatchEvent(event);
  }
});

async function sendMessage(phoneNumber, message, firstName = "") {
  try {
    phoneNumber = phoneNumber.replace("+", ""); // Remove '+' if present
    const whatsappNumber = phoneNumber + "@c.us";
    await client.sendMessage(whatsappNumber, message);
    console.log(`Message sent to ${whatsappNumber}`);
  } catch (error) {
    console.error(`Failed to send message to ${phoneNumber}`, error);
  }
}



client.on("message", async (msg) => {
  if (msg.body.toLowerCase() === "start") {
    const userId = msg.from;
    // const name = firstName;
    const name = firstName; // Use the updated firstName here

    setConversationState(userId, { stage: "question1" });
    setTimeout(() => {
      client.sendMessage(
        userId,
        `To assist you in finding your ideal home, we're eager to learn more about your preferences. If you prefer to skip the question, simply type '*skip*'.`
      );
    }, 3000);
    setTimeout(() => {
      client.sendMessage(
        userId,
        `📍Location: What's your ideal area or neighborhood?`
      );
    }, 5000);
  } else if (msg.body.toLowerCase() === "budget") {
    const userId = msg.from;
    setConversationState(userId, { stage: "question1" });
    setTimeout(() => {
      client.sendMessage(
        userId,
        `🌟 Minimum Budgets for 1 Bedroom Apartments 🌟

Please note that for multiple bedrooms, a higher budget may be necessary. You should think about an additional €400 euros per extra bedroom.
        
Per month, excluding utilities:
•⁠  ⁠Amsterdam: €1800 
•⁠  ⁠Rotterdam: €1500
•⁠  ⁠Utrecht: €1000 
•⁠  ⁠The Hague: €1500 
•⁠  ⁠Haarlem: €1800 
        
Feel free to reach out if you have any questions or need further assistance! 😊🏡`
      );
    }, 2000);

    setTimeout(() => {
      client.sendMessage(
        userId,
        `If you wish to increase your budget, please re-submit your details on our website https://ynsagency.nl. We'll reach out to you shortly and strive to find you a new home that fits your preferences!`
      );
    }, 3000);

    setTimeout(() => {
      client.destroy();
    }, 5100);

  } else {
    const userId = msg.from;
    const state = getConversationState(userId);

    switch (state.stage) {
      case "question1":
        setConversationState(userId, { stage: "question2" });
        setTimeout(() => {
          client.sendMessage(
            userId,
            `🏠 Could you describe your dream home please? What features make it perfect? (e.g., view, balcony, spacious, elegant, cozy).`
          );
        }, 2000);
        break;
      case "question2":
        setConversationState(userId, { stage: "question3" });

        setTimeout(() => {
          client.sendMessage(
            userId,
            `❌ Any deal-breakers? (e.g., noisy location, lack of natural light)`
          );
        }, 2000);
        break;
      case "question3":
        const budget1 = newBudget;
        setConversationState(userId, { stage: "question4" });
        setTimeout(() => {
          client.sendMessage(
            userId,
            `Shall we stick to listings within your budget of €${budget1} only? 😊 

Or open to exceeding it for the right match? Please reply with your max budget.`
          );
        }, 2000);
        break;
      case "question4":
        setConversationState(userId, { stage: "question5" });
        client.sendMessage(
          userId,
          `🎉 Thank you for the info! Ready to find your dream home? Type '*ready*' to begin.`
        );
        break;
      case "question5":
        setConversationState(userId, { stage: "question6" });
        client.sendMessage(
          userId,
          `Alright, let's do this! 😄 We'll do our best for you! 💪`
        );

        setTimeout(() => {
          client.sendMessage(
            userId,
            `To offer you the most effective support, we need to understand your financial situation better. Would you mind sharing some details about yourself, including your occupation, gross monthly income, etc.?`
          );
        }, 1000);
        break;
      default:
        // Optional: handle unexpected messages or reset the conversation
        break;
    }
  }
});

client.on('disconnected', (reason) => {
  console.log('Client was disconnected!', reason);
  qrDataUrl = null; // Reset the QR code data URL so it can be regenerated
  initializeWhatsAppClient(); // Attempt to reinitialize the client
});




module.exports = { sendMessage, generateQRCode };
