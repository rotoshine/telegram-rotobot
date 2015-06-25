var glob = require('glob');
var _ = require('underscore');
var config = require('./config');
var mongoose = require('mongoose');
mongoose.connect(config.mongoUrl);

var modelPaths = glob.sync('./models/*.js');
_.each(modelPaths, function(modelPath){
	require(modelPath)(mongoose);	
	console.log(modelPath + ' model loaded.');
});

module.exports = mongoose;