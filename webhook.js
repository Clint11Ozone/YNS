const { sendMessage } = require("./whatsapp");
const db = require("./database")

async function checkMoveInDate(moveInDate) {
  // Calculate the difference in milliseconds between move-in date and today
  const differenceInTime = new Date(moveInDate).getTime() - Date.now();

  // Calculate the difference in days
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  // Return true if move-in date is 35 days or less from today, false otherwise
  return differenceInDays <= 35;
}

const cityBudgets = [
  { name: "Amsterdam", budget: 1800 },
  { name: "Rotterdam", budget: 1000 },
  { name: "Utrecht", budget: 1000 }, // Assuming monthly budget is converted to yearly
  { name: "Den Haag", budget: 1000 },
  { name: "Haarlem", budget: 1800 },
];

async function handleWebhook(req, res) {
  const payload = req.body;
  const fields = payload.data.fields;
  console.log(payload);

  // Extracting specific values
  const firstName = fields.find((field) => field.label === "First Name")?.value;
  const moveInDate = fields.find((field) => field.label === "Move-in date")?.value;
  const householdComposition = fields.find((field) => field.label === "Please describe the composition of the household.")?.options.find((option) => option.id === fields.find((field) => field.label === "Please describe the composition of the household.").value[0])?.text;
  const interior = fields.find((field) => field.label === "Interior")?.options.find((option) => option.id === fields.find((field) => field.label === "Interior").value[0])?.text;
  const budget = fields.find((field) => field.label === "Budget")?.value;
  const chosenCityOption = fields.find((field) => field.label === "City")?.options.find((option) => option.id === fields.find((field) => field.label === "City").value[0]);
  const chosenCity = chosenCityOption?.text;
  const cityBudget = cityBudgets.find((city) => city.name === chosenCity)?.budget;

  console.log(`First Name: ${firstName}`);
  console.log(`Budget: ${budget}`);
  console.log(`City: ${chosenCity}`);
  console.log(`Move-in Date: ${moveInDate}`);
  console.log(`Household Composition: ${householdComposition}`);
  console.log(`Interior: ${interior}`);
  console.log(`Chosen City: ${chosenCity}`);
  console.log(`City Budget: ${cityBudget}`);

  const phoneNumber = "+27760399608";
  const phone = "27760399608"

  await db.saveUserDetails(phone, {
    firstName, moveInDate
});

  // Check if user's budget is within the city budget range
  if (parseInt(budget) >= parseInt(cityBudget)) {
    if (await checkMoveInDate(moveInDate)) {
      const message = `Hi ${firstName}, we're excited to help you find your new home quickly. To get started, type 'start'.`;
      await sendMessage(phoneNumber, message);
    } else {
      const message = `Hi ${firstName}, we can’t wait to help you find your new home on ${moveInDate}. Don’t worry, we will notify you by then. In the meantime, feel free to reach out if you have any questions.`;
      await sendMessage(phoneNumber, message);
    }
  } else {
    const message = `Hi ${firstName}, we have received your registration on our website. Unfortunately, we cannot proceed with the budget you have provided. Considering the current housing market conditions and our no cure, no pay policy, we have had to establish a minimum budget requirement. Thank you for your understanding. If you would like to inquire about the minimum budgets, please respond with 'budget'.`;
    await sendMessage(phoneNumber, message);
  }

  res.status(200).send("Webhook received successfully");

  return firstName;
} 



module.exports = { handleWebhook};

