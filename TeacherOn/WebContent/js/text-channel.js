var socket;
var medium;

var roomId='';

var bot_id_array;
var botID='';
var hostname1 = '';

console.log('guid random generated --->>>'+guid);

var socket_login = io();

socket_login.on('hostname', function(hostname){
	hostname1 =  hostname;
	console.log("got the hostname: "+ hostname);
});

socket=io.connect('http://192.168.1.101:8080' ,{secure:true,rejectUnauthorized: false});	//local machine IP
medium = socket;
socket_login.emit('login_msg','connected to login socket');

socket_login.emit('fire','connected to login socket on other port');


/*socket_login.on('userId', function(userId){
	objectId=userId;
	console.log("got the user id: "+ objectId);
});
*/
/*socket_login.on('bot_id',function(bot_id){		
	console.log("---------- Bot id recieved");
	bot_id_array=bot_id;

	for(var i=0;i<bot_id_array.length;i++)	{
		if(JSON.parse(bot_id_array[i]).botname==gOptions.botName)	{
			botID=JSON.parse(bot_id_array[i]).id;
		}
	}*/
	/*console.log('Bot id is---' + botID);*/

	
	function roomidfunction(objectId){
		botID = '590c4f053e26e2ff8b932ce6'; 		// Bot id // 59103d9e09b7c8b96af62e48
		// also objectid from mysql 
		//console.log("ObjectId -------> "+objectId);
	
		//roomId = botID+'-'+objectId+'-'+guid;
		roomId = botID+'-'+guid;
		console.log('roomId---------->'+roomId);
		socket.emit('room',  roomId ); 
	}
	
/*});*/
/*
socket_login.on('gender', function(gender_value){
	gender =  gender_value;
	console.log("got the gender: "+ gender);	
});	

socket_login.on('username', function(username){
	userName=username;
	$("#user_name").html("<b>"+ username +"</b>");
	$("#user_name1").html("<b>"+ username +"</b>");
	console.log("got the username: "+ username);
});	
*/
console.log("text channel started");

openTextSocketConnection();  
	 
	
function S4() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
		
		
// Open the primary socket connection for subsequent communication
function openTextSocketConnection(){ 
	// When the socket recieves a message
	socket.on('output-from-jarvis', function(data){
		displayIncomingMessage(data.data);
		$("#record_button").css("visibility","visible");
		$("#demo").attr("placeholder","Say Something ...");
	});
	
}

// Emit a text message to the passed socket - Message goes to the chat server
function emitTextMessageInSocket(socket, messageInDiv){		
	socket.emit('input-to-jarvis', messageInDiv);
}
