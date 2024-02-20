const EventEmitter = require('events');
class Context extends EventEmitter {}
const context = new Context();
module.exports = context;
