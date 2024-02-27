const { Client, NoAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const {
  getConversationState,
  setConversationState,
} = require("./conversationState");
const context = require("./context");

const client = new Client({ authStrategy: new NoAuth() });

client.initialize();

async function generateQRCode() {
  return new Promise((resolve, reject) => {
    client.on("qr", (qr) => {
      qrcode.toDataURL(qr, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  });
}
client.on("ready", () => {
  console.log("WhatsApp Client is ready for connection!");
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

let firstName = "";

context.on("firstName", (name) => {
  firstName = name;
});
context.on("budget", (budget) =>{
  newBudget = budget
});

client.on("message", async (msg) => {
  if (msg.body.toLowerCase() === "start") {
    const userId = msg.from;
    // const name = firstName;
    const name = firstName; // Use the updated firstName here

    setConversationState(userId, { stage: "question1" });

    setTimeout(() => {
      client.sendMessage(
        userId,
        `${name} To help you find your perfect home, we'd love to know more about what you like. This will help us tailor the search just for you:`
      );
    }, 3000);
  } else if(msg.body.toLowerCase() === "budget"){
    const userId = msg.from;
    setConversationState(userId, { stage: "question1" });
    setTimeout(() => {
      client.sendMessage(
        userId,
        `🌟 Minimum Budgets for 1 Bedroom Homes 🌟
Before we embark on our journey, here are the minimum budgets we adhere to. Please note that for multiple bedrooms, a higher budget may be necessary.
Amsterdam: €1800 per monthRotterdam: €1500 per monthUtrecht: €1000 per monthDen Haag (The Hague): €1500 per monthHaarlem: €1800 per monthFeel free to reach out if you have any questions or need further assistance! 😊🏡`
      );
    }, 3000);
  } else {
    const userId = msg.from;
    const state = getConversationState(userId);

    switch (state.stage) {
      case "question1":
        setConversationState(userId, { stage: "question2" });
        setTimeout(() => {
          client.sendMessage(
            userId,
            `📍Location: What's your ideal area or neighborhood?`
          );
        }, 3000);
        break;
      case "question2":
        setConversationState(userId, { stage: "question3" });
        setTimeout(() => {
          client.sendMessage(
            userId,
            `🏠 Describe your dream home in 5 words: What features make it perfect? (e.g., view, balcony, spacious, elegant, cozy)`
          );
        }, 3000);
        break;
      case "question3":
        setConversationState(userId, { stage: "question4" });

        setTimeout(() => {
          client.sendMessage(
            userId,
            `🤩 Any other must-haves or deal-breakers? (e.g., home office, backyard, pet-friendly)`
          );
        }, 3000);
        break;
      case "question4":
        setConversationState(userId, { stage: "question5" });
        setTimeout(() => {
          client.sendMessage(
            userId,
            `🎉 Thank you for the info! Ready to find your dream home? Type "Ready" to begin.`
          );
        }, 3000);
        setTimeout(() => {
          client.sendMessage(
            userId,
            `📈 Speed up the process! Upload your documents now for priority assistance and get listings faster. https://upload.ynsagency.nl
  
PS. Can't click the link? Just add us to contacts to activate it!

✅ Type 'done' after uploading.
  
😕 Prefer not to? Type 'listings'.`
          );
        }, 10000);
        break;
      case "question5":
        const budget1 = newBudget;
        setConversationState(userId, { stage: "question6" });
        setTimeout(() => {
          client.sendMessage(
            userId,
            `Shall we stick to listings within your budget of ${budget1} only? 😊 

Or open to exceeding it for the right match? Please reply with your max budget.`
          );
        }, 5000);
        break;
      default:
        // Optional: handle unexpected messages or reset the conversation
        break;
    }
  }
});

module.exports = { sendMessage, generateQRCode };
