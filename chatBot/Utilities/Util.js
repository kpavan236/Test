//'use strict';

//function to trim path
module.exports.trimPath = function(str, chr, skipLevels, callback){
		for(i=skipLevels;i>0;i--)
		{
			str = str.substring(0,str.lastIndexOf(chr));
		}
		callback(str);
	};