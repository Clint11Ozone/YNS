const EventEmitter = require('events');
// import EventEmitter from 'events';
class Context extends EventEmitter {}
const context = new Context();
module.exports = context;
