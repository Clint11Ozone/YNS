const http = require('http');
const cron = require('node-cron');

const targetUrl = process.env.TARGET_URL || 'https://yns23.onrender.com'; // Replace with your Render app URL

function pingServer() {
  http.get(targetUrl, (res) => {
    console.log(`Server pinged at ${new Date().toISOString()}`);
    res.resume();
  }).on('error', (err) => {
    console.error(`Error pinging server: ${err.message}`);
  });
}

function startKeepAlive() {
  cron.schedule('*/2 * * * *', pingServer);
  console.log('Server self-pinging mechanism started');
}

module.exports = {
  startKeepAlive,
};