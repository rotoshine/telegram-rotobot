var config = require('./config');
var collectCycle = config.collectCycle || 500;
var telegram = require('./telegram');

var currentOffset = null;
function start(){		
	telegram.getUpdates(function(message_id){		
		setTimeout(start, collectCycle);
	});
}

exports.start = start;
