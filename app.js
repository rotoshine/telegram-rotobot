var config = require('./config.js');
var telegram = require('./telegram');
var logProcessor = require('./logProcessor');
var logCollector = require('./logCollector');

logCollector.start();
console.log('log collect start.');

logProcessor.process();	
console.log('log processing start.');

console.log('telegram-rotobot on.');

