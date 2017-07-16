var Enum = require('enum');

var ComponentStatus = new Enum(['STARTING','STARTED','STOPPED','FAILED']);

module.exports.ComponentStatus=ComponentStatus;