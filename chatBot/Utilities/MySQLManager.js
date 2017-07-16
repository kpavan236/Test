'use strict';

var c_mysql     = require('mysql');
var PropertiesReader = require('properties-reader');


var util = require('./Util.js');
var bootstrapDir = '';

var path = require('path');

//var bootstrapDir = PropertiesReader('../PlatformAPI/BootStrapProperties.js');
util.trimPath(module.filename,path.sep,2,function(dir){
	bootstrapDir = dir;
});
var c_properties = PropertiesReader(bootstrapDir+'/BootStrapProperties.js');

var c_logger = require('./Logger.js')(module);
//https://github.com/mysqljs/mysql
var c_poolid = 0;

class MySQLManager
{
	constructor(p_host, p_port, p_user,p_passwd, p_dbname, p_maxconnections, p_debug)
	{
		var c_mypoolid = ++c_poolid;
		c_logger.debug("Initializing Pool with poolid ..." + c_mypoolid);
		//private variable
		var c_pool  = c_mysql.createPool({
				
				host     : p_host,
				port     : p_port,
				user     : p_user,
				password : p_passwd,
				database : p_dbname,
				connectionLimit : p_maxconnections,
				debug: p_debug 
				
		});
		c_logger.debug("Pool " + c_mypoolid +" Initialization completed.");
		c_pool.on('acquire', function (connection)
			{
				c_logger.debug('Connection %d acquired from pool ' + c_mypoolid, connection.threadId);
			}
			);
		
		c_pool.on('release', function (connection)
			{
				c_logger.debug('Connection %d released to pool ' + c_mypoolid, connection.threadId);
			}
			);
		
		//priviledged function to get the connection
		this.getConnection = function(callback)
		{
			c_logger.debug("Inside getConnection of pool " + c_mypoolid);
			c_pool.getConnection(function(p_err, p_connection)
				{
					if(p_err)
					{
						c_logger.error("Error occured while fetching connection from the Mysql Pool " + c_mypoolid, p_err);
						throw p_err;
					}
					else
					{
						c_logger.debug("invoking callback after getting connection");
						callback(p_connection);
					}
				}
				);
		}//End of function getConnection
		
		//priviledged function to shutdown the pool
		this.shutdown = function()
		{
			c_pool.end(function()
				{
					c_logger.debug("Shutting down connection pool " + c_mypoolid);
					c_pool = null;
				}
				);
		}
	}//End of constructor
	
	
	executeBulkDML(p_query_arr, p_bindVariables_arr, callback)
	{
		c_logger.debug("Entering executeBulkDML. query " + p_query_arr +". bindvars " + p_bindVariables_arr);
		
		let l_errors=[], l_results=[], l_fields=[];
		
		this.getConnection(function(p_conn)
			{
				c_logger.debug("got connection " + p_conn + " from pool.");
				p_conn.beginTransaction(function(err)
					{
						c_logger.debug("Inside beginTransaction");
						
						if (err)
						{
							c_logger.error("Error begining transaction. Throwing exception ", err);
							throw err;
						}
						
						var allDone = false;
						for(var i=0;i<p_query_arr.length;i++)
						{
							p_conn.query(p_query_arr[i], p_bindVariables_arr[i], function (error, results, fields)
								{
									c_logger.debug("results after executing DML " + results + " error " + error);
									
									if (error)
									{
										c_logger.error("Error executing query. Rolling back the transaction.", error);
										return p_conn.rollback(function()
											{
												p_conn.release();
												throw error;
											}
											);
									}
									else
									{
										l_errors.push(error);
										l_results.push(results);
										l_fields.push(fields);
										c_logger.debug("DML execution successful.");
									}
									
									if(l_results.length == p_query_arr.length)
									{
										c_logger.debug("going to commit transaction.");
										p_conn.commit(function(err)
											{
												if (err)
												{
													c_logger.error("Could not commit transaction", err);
													return p_conn.rollback(function()
														{
															throw err;
														}
														);
												}
												else
												{
													c_logger.debug("Commit successful. Releasing connection back to the pool.");
												}
											}
											);
										p_conn.release();
										callback(l_errors,l_results,l_fields);
									}
								}
								);
						}//End of for query loop
					}
					)//End of beginTransaction
			}
			)//End of getConnection
		c_logger.debug("Exiting executeBulkDML");
	}//End of executeBulkDML
	
	executeDML(p_query, p_bindVariables, callback)
	{
		c_logger.debug("Entering executeDML. query " + p_query +". bindvars " + p_bindVariables);
		this.executeBulkDML([p_query], [p_bindVariables], callback);
		c_logger.debug("Exiting executeDML");
	}
	
	executeQuery(p_query, p_bindVariables, callback)
	{
		c_logger.debug("Entering executeQuery. query " + p_query +". bindvars " + p_bindVariables);
		this.getConnection(function(p_conn)
			{
				c_logger.debug("got connection " + p_conn +" inside executeQuery");
				p_conn.query(p_query, p_bindVariables, function (error, results, fields)
					{
						if (error)
						{
							c_logger.error("Error executing query ", error);
							throw error;
						}
						c_logger.debug("got " + results.length +" results after executing query " + results);
						callback(error,results,fields);
					}
					);
				
				c_logger.debug("Releasing connection back to the pool." + p_query);
				p_conn.release();
			}
			);
		c_logger.debug("Exiting executeQuery");
	}
}
//p_host, p_port, p_user,p_passwd, p_dbname, p_maxconnections, p_debug


var mysql = new MySQLManager(c_properties.get('mysql-db-host'), c_properties.get('mysql-db-port'), c_properties.get('mysql-db-username'), c_properties.get('mysql-db-password'), c_properties.get('mysql-db-dbname'), c_properties.get('mysql-db-maxconnections'), c_properties.get('mysql-db-debug'));
module.exports = mysql;
module.exports.MySQLManager = MySQLManager;
