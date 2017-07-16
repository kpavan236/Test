var winston = require('winston');
var PropertiesReader = require('properties-reader');

var util = require('./Util.js');
var bootstrapDir = '';

var path = require('path');

//var properties = PropertiesReader(module.filename+'/../../BootStrapProperties.js');
util.trimPath(module.filename,path.sep,2,function(dir){
	bootstrapDir = dir;
});
var properties = PropertiesReader(bootstrapDir+'/BootStrapProperties.js');

winston.emitErrs = true;
var c_callingmodule;

var getLabel = function() {
    var parts = c_callingmodule.filename.split(path.sep);    
    return parts[parts.length - 2] + '/' + parts.pop();
};


module.exports = function(callingmodule){
	c_callingmodule = callingmodule;
	return new winston.Logger({
    transports: [
        new winston.transports.File({
			timestamp:function(){
				return new Date(Date.now()).toString('yyyy-MM-ddTHH:mm:ss');
			},
			label: getLabel(),
            level: 'debug',
            filename: properties.get('logfile-path'),
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
			label: getLabel(),
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});
};
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};