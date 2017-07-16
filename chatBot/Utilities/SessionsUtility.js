
'use strict';

// Load dependencies
var c_util = require('./Util.js');
var c_bootstrapDir = '';
var c_path = require('path');

c_util.trimPath(module.filename,c_path.sep,2,function(dir){
	c_bootstrapDir = dir;
});
var PropertiesReader = require('properties-reader');
var c_properties = PropertiesReader(c_bootstrapDir+'/BootStrapProperties.js');
var c_url = 'mongodb://'+c_properties.get('mongo-db-host')+':'+c_properties.get('mongo-db-port')+'/'+c_properties.get('mongo-db-name') ;

// Instance of Mongo DB adapter
var MongoDBManager = require('./MongoDBManager.js').MongoDBManager;
var c_mongoDBManager = new MongoDBManager(c_url);

var c_logger = require('./Logger.js')(module);




// Class sessions utility
class SessionsUtility{
	
	constructor()
	{			
	}
	
	// Manage a user session
	manageUserSession( p_userId, p_sessionsInformation, p_data, p_medium, p_userInteraction, p_channelAdaptor,callback)
	{
	
				
		if( null != p_userId){
			  
			c_logger.info('Inside session mangement');
			//console.log('Sessions collection name' +    console.log(JSON.stringify(p_sessionsInformation, null, 3)));
			this.checkIfTheUserExists(p_userId , p_sessionsInformation , p_data, p_medium , p_userInteraction, p_channelAdaptor,function(p_sessionId){
				callback(p_sessionId);
			});  
		}else{ 
			c_logger.debug( 'There is an issue observed with sessions management' );  
			  // TODO - Add a logger here 
		}

	}
	
	// Check if user exists
	checkIfTheUserExists(p_userId , p_sessionsInformation , p_data, p_medium, p_userinteraction, p_channelAdaptor,callback){
		
		c_logger.info("session information :: "+JSON.stringify(p_sessionsInformation));
		// this the callback function called after checking if the user exists or not
		var l_fetchesIfUserIDExists = function(p_responseforuserid)
		{   
		
		var l_captureLastTransactionTime = function(p_responsecapturetransactiontime)
		{
				
			var l_currentDate = new Date();
			
			var l_currentTime = l_currentDate.getTime();
				
			c_logger.info("Response retrieved for last transaction date time :: " +JSON.stringify(p_responsecapturetransactiontime));
			
			var l_sessionId = p_responsecapturetransactiontime[0].sessionID;
			var l_lastTransactionTime = p_responsecapturetransactiontime[0].lastTransactionDatetime;
			c_logger.info("Last transaction date time :: "+ l_lastTransactionTime);
			
			var l_minutesDifference = l_computeMinutesDifference(l_lastTransactionTime);
			c_logger.info(" Difference in minutes is  :: "+ l_minutesDifference);

		    // If the session has expired
			if( l_minutesDifference > p_sessionsInformation.sessionstimeoutinminutes )
			{
				c_logger.info("The session has been expired .. Please log in again");
				
				//destroy the session id and create a new one for the same user
				
					var l_update_random_session_id = l_generateRandomSessionID();
					c_logger.info('Generating session Id for updation' + l_update_random_session_id)
								
					// Update the sessions ID in the DB			         
					c_mongoDBManager.updateSessionIdCollection(p_userId, p_sessionsInformation.sessionscollection , l_update_random_session_id);
					
					// Manage the user interaction
				//p_userinteraction.manageUserInteraction(p_userId, p_data, p_medium, l_update_random_session_id, p_channelAdaptor);
				
					callback(l_update_random_session_id);	
			}
			// If the session has not expired
			else if( l_minutesDifference < p_sessionsInformation.sessionstimeoutinminutes)
			{
				
                console.log("Updated current time in collection");				
				// Update the last time in the DB
				c_mongoDBManager.updateInCollection(p_userId, p_sessionsInformation.sessionscollection  , l_currentTime);
				
				// Manage user interaction
				//p_userinteraction.manageUserInteraction(p_userId, p_data, p_medium, sessionId, p_channelAdaptor);
					callback(l_sessionId);
			}
				
		} 
		      
		
		
			if(p_responseforuserid)
			{
			
				//user exists - now fetch the session Id and last transaction time of the existing user to check if the session has expired or not - uses callback function "captureLastTransactionTime"
				c_logger.info("This user exits .. fetching the sessionId of the user");
				c_mongoDBManager.fetchBotSessionID(p_userId,p_sessionsInformation.sessionscollection,
				l_captureLastTransactionTime);
			}
			else{
			
			//user does not exist, create a new user with a new randomly generated session id
			console.log("User Does not exist ..");
			
					// Create a session Id entry using a random 16 digit no
					var l_random_session_id = l_generateRandomSessionID();
					c_logger.info("Random session id :: "+l_random_session_id);
					
						
						//creating the document for mongo
						var l_sessionIdEntry = {
		  
							"_id" : p_userId,
							"sessionID":l_random_session_id,
							"lastTransactionDatetime": new Date()
		  
							}
		  
							// Callback function - does nothing, may be required in the future
								var sessionCallBackFunction = function(){
			  
										c_logger.info('Message inserted');
										//c_mongoDBManager.fetchBotUserID(p_userId, collectionName , fetchesIfUserIDExists);
				
									}
		  
							    // Insert the timestamp in the collection
								c_mongoDBManager.insertMessageInCollection(
										l_sessionIdEntry, 
										p_sessionsInformation.sessionscollection, 
										sessionCallBackFunction);
										
								// Continue the user interaction		
								//p_userinteraction.manageUserInteraction(p_userId, p_data, p_medium, l_random_session_id, p_channelAdaptor);
								callback(l_random_session_id);
			
			}
		
		}
		
		//fetches if the user Id is present , calls the callback "fetchesIfUserIDExists" with the result
		c_mongoDBManager.fetchBotUserID( p_userId , p_sessionsInformation.sessionscollection , l_fetchesIfUserIDExists);
		
		//************
	    var l_generateRandomSessionID = function(){
			
			return  Math.random() * 1E16;
			
		}
		
		//***********
		 var l_computeMinutesDifference = function(p_lastTransactionTime){
			
			var l_currentDate = new Date();
			var l_currentTime = l_currentDate.getTime();
			c_logger.info("Current Datetime :: "+l_currentTime);
			p_lastTransactionTime = p_lastTransactionTime.getTime();
			c_logger.info("Last Transaction datetime :: " + p_lastTransactionTime);
			var l_difference = l_currentTime - p_lastTransactionTime;
			var l_minutesDifference = Math.floor(l_difference / 1000 / 60);
			l_difference -= l_minutesDifference * 1000 * 60
			return l_minutesDifference;	
		}
	}
		
		
		
		
		
	}
	
	
	

module.exports.SessionsUtility = SessionsUtility;