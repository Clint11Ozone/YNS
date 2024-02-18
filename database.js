const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('whatsapp_bot.db');

db.serialize(() => {
  // Create table for user details
  db.run("CREATE TABLE IF NOT EXISTS user_details (phone TEXT PRIMARY KEY, firstName TEXT, moveInDate TEXT)");
});

function getUserDetails(phone, callback) {
  db.get("SELECT firstName FROM user_details WHERE phone = ?", [phone], (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
}

function saveUserDetails(phone, userDetails) {
  db.run("INSERT OR REPLACE INTO user_details (phone, firstName, moveInDate) VALUES (?, ?, ?)", 
         [phone, userDetails.firstName, userDetails.moveInDate]);
}

module.exports = { getUserDetails, saveUserDetails };
