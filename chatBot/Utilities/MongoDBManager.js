'use strict';

// Imports
var ConfigurationManager = require('../ConfigurationManager/ConfigurationManager.js').ConfigurationManager;
var c_configurationmanager =  new ConfigurationManager();
var c_mongodb = require('mongodb');
var c_assert = require('assert');

var c_util = require('./Util.js');
var c_bootstrapDir = '';
var c_path = require('path');

c_util.trimPath(module.filename,c_path.sep,2,function(dir){
	c_bootstrapDir = dir;
});
var c_url='';
var c_messagesCollection='';
var c_logger=require('./Logger.js')(module);

var c_connectionurl='';


var c_logger = require('./Logger.js')(module);

var PropertiesReader = require('properties-reader');
var c_properties = PropertiesReader(c_bootstrapDir+'/BootStrapProperties.js');


var c_url = 'mongodb://'+c_properties.get('mongo-db-host')+':'+c_properties.get('mongo-db-port')+'/'+c_properties.get('mongo-db-name') ;



// Instantiations
var MongoClient = c_mongodb.MongoClient;

class MongoDBManager{
	
	constructor(p_mongourl)
	{	
	
		/* let l_paramnames = ['mongo-db-host','mongo-db-port','mongo-db-name'];
		c_configurationmanager.getConfigParamsByListUsingNames(p_instancename, 'CommonConfig',l_paramnames,function(p_configparammap){
			c_connectionurl='mongodb://'+ p_configparammap.get('mongo-db-host') +':'+ p_configparammap.get('mongo-db-port') +'/' + p_configparammap.get('mongo-db-name');
			c_logger.info('Mongo DB c_url : ' + c_connectionurl);
		}); */
		c_url = p_mongourl;
	}
	
	// Insert a message in collection
	insertMessageInCollection(p_message, p_messagesCollection,p_callbackFunction)
	{
		c_logger.info("Message to push ###############" + p_message + " to collection "+ p_messagesCollection);
		MongoClient.connect(c_url, function(p_err, db) {
			c_assert.equal(null, p_err);
			db.collection(p_messagesCollection).insert( p_message, function(p_err, p_result) {
				//c_assert.equal(p_err, null);
				c_logger.info('Inserted a message into collection ' + p_messagesCollection);
				p_callbackFunction(true);
				db.close();
			});
		});
	}
	
	//check if the session already exists
	fetchBotSessionID(p_userId, p_configurationCollection, p_callbackFunction)
	{
		
		c_logger.info('Checking the session for id  ::  ' +p_userId+ "c_url "+c_url);
		MongoClient.connect(c_url, function(p_err, db) {
			c_assert.equal(null, p_err);
			//Fetch the bot configuration
			db.collection(p_configurationCollection).find({'_id': p_userId}).toArray(function (p_err, p_result) {
			
				if (p_err) 
				{
					c_logger.error(p_err);
				}
				else if (p_result.length) 
				{	
					c_logger.debug("The sessionId for user "+p_userId+" is "+p_result);
					p_callbackFunction(p_result);
				}
				else 
				{
					c_logger.info('No document(s) found with defined "find" criteria!');
					p_callbackFunction(false);
					
				}
				
				//Close connection
				db.close();
			});
		});		
	}
	
	fetchBotUserID(p_userId, p_configurationCollection, p_callbackFunction)
	{
		c_logger.debug('Checking if the user id exists ::  ' +p_userId+"configurationCollection"+p_configurationCollection);
		MongoClient.connect(c_url, function(p_err, db) {
			c_logger.info("Inside mongo callback");
			c_assert.equal(null, p_err);
			//Fetch the bot configuration
			db.collection(p_configurationCollection).find({'_id': p_userId}).toArray(function (p_err, p_result) {
				if (p_err) 
				{
					c_logger.error(p_err);
				}
				else if (p_result.length) 
				{	
			        c_logger.info('Document found with defined "find" criteria!');
					p_callbackFunction(true);
				}
				else 
				{
					c_logger.info('No document(s) found with defined "find" criteria!');
					p_callbackFunction(false);
					
				}
				
				//Close connection
				db.close();
			});
		});		
	
	}
	
	
	
	// find the configuration for a Bot
	fetchBotConfiguration(p_botName, p_configurationCollection, p_callbackFunction)
	{
		var l_configuration='';
		c_logger.debug('Fetching the configuration for Bot : ' + p_botName);
		MongoClient.connect(c_url, function(p_err, db) {
			c_assert.equal(null, p_err);
			//Fetch the bot configuration
			db.collection(p_configurationCollection).find({'botconfiguration.botname': p_botName}).toArray(function (p_err, p_result) {
				if (p_err) 
				{
					c_logger.error(p_err);
				}
				else if (p_result.length) 
				{				
					// If p_result is not null and we have only one record for the configuration
					if(null != p_result && 1 == p_result.length)
					{
						l_configuration = p_result[0];
						c_logger.debug(l_configuration);
						// Invoke the passed callback function with the configuration as a parameter
						//p_callbackFunction(configuration);
					}
				}
				else 
				{
					c_logger.info('No document(s) found with defined "find" criteria!');
					
				}
				p_callbackFunction(l_configuration);
				//Close connection
				db.close();
			});
		});		
	}
	
	// find the configuration for a Bot
	deleteBotConfiguration(p_botName, p_configurationCollection, p_callbackFunction)
	{		
		c_logger.info('Deleting the configuration for Bot : ' + p_botName);
		MongoClient.connect(c_url, function(p_err, db) {
			c_assert.equal(null, p_err);
			//Fetch the bot configuration
			db.collection(p_configurationCollection).deleteMany({'botconfiguration.botname': p_botName},function (p_err, p_result) {
				var l_metaDataDeleted=false;
				var l_configuration='';
				
				if(!p_err)
				{
					l_metaDataDeleted = true;
				}
				c_logger.debug("MetaDataDeleted for bot name :"+p_botName + " : "+l_metaDataDeleted);
				p_callbackFunction(l_metaDataDeleted);
				db.close();
			});
		});
	}	
	
	
	// find the configuration for a Bot
	fetchLastCommunication(p_botName, p_configurationCollection, p_callbackFunction)
	{
		var l_configuration='';
		c_logger.debug('Fetching the configuration for Bot : ' + p_botName);
		MongoClient.connect(c_url, function(p_err, db) {
			c_assert.equal(null, p_err);
			//Fetch the bot configuration
			db.collection(p_configurationCollection).find({'_id': p_botName}).toArray(function (p_err, p_result) {
				if (p_err) 
				{
					c_logger.error(p_err);
				}
				else if (p_result.length) 
				{				
					// If p_result is not null and we have only one record for the configuration
					if(null != p_result && 1 == p_result.length)
					{
						l_configuration = p_result[0];
						c_logger.debug(l_configuration.lastTransactionDatetime);
						// Invoke the passed callback function with the configuration as a parameter
						//p_callbackFunction(configuration);
					}
				}
				else 
				{
					c_logger.info('No document(s) found with defined "find" criteria!');
				}
				p_callbackFunction(l_configuration.lastTransactionDatetime);
				//Close connection
				db.close();
			});
		});		
	}
	
	updateInCollection(p_id, p_collection,p_timestamp,p_callbackFunction)
	{
		c_logger.debug("Updating the last transaction time field with :: "+new Date(p_timestamp)+" :: where the session ID is :: "+p_id);
		MongoClient.connect(c_url, function(p_err, db) {
			c_assert.equal(null, p_err);
			db.collection(p_collection).update({_id: p_id}, {$set: {lastTransactionDatetime: new Date(p_timestamp)}}, function (p_err, p_numUpdated) {
			if (p_err) {
					c_logger.error(p_err);
			} else if (p_numUpdated) {
					c_logger.deug('Updated Successfully %d document(s).', p_numUpdated);
			} else {
					c_logger.debug('No document found with defined "find" criteria!');
			}
				//Close connection
				db.close();
			});
		});
	}
	
	
	updateSessionIdCollection(p_id, p_collection,p_sessionId)
	{
		c_logger.debug("Updating the sessionId field where user Id is  :: "+p_id+" :: with :: "+p_sessionId);
		MongoClient.connect(c_url, function(p_err, db) {
			c_assert.equal(null, p_err);
			db.collection(p_collection).update({_id: p_id}, {$set: {sessionID: p_sessionId}}, function (p_err, p_numUpdated) {
			if (p_err) {
					c_logger.error(p_err);
			} else if (p_numUpdated) {
					c_logger.debug('Updated Successfully %d document(s).', p_numUpdated);
			} else {
					c_logger.info('No document found with defined "find" criteria!');
			}
				//Close connection
				db.close();
			});
		});
	}
	
}
module.exports.MongoDBManager = MongoDBManager;
