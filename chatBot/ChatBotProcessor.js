'use strict';

class ChatBotProcessor	{
	constructor(){
		
	}
	manageProcessing(botObject)	{
		if(val.result.action == 'Others'){

			spokenResponse = val.result.speech;
			respond(spokenResponse);
		} else {
			spokenResponse = val.result.speech;
			respond(spokenResponse);
		}
	}
}
module.exports = ChatBotProcessor;