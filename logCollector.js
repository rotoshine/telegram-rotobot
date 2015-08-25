var config = require('./config');
var collectCycle = config.collectCycle || 500;
var telegram = require('./telegram');

var currentOffset = null;
function start(){		
	setInterval(function(){
		try{
			telegram.getUpdates();
		}catch(e){
			console.log(e);
		}
	}, collectCycle);
}

exports.start = start;
