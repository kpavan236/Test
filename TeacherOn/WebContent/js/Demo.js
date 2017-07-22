var micRecord = 'false';
var errorMessage = 'Hi, there was an issue connecting with the chat server, please try again in some time';
var pageLoad = 0;

var accessToken = "100322c3ef724681a7c6a5f9bc7d6cb9",
      baseUrl = "https://api.api.ai/v1/",
      $speechInput,
      $recBtn,
      recognition,
      messageRecording = "Recording...",
      messageCouldntHear = "I couldn't hear you, could you say that again?",
      messageInternalError = "Oh no, there has been an internal server error",
      messageSorry = "I'm sorry, I don't have the answer to that yet.";
	  
	  
    // A utility method to get current date time
    function getTimeDate() {
		var date=new Date();
		var month=1+date.getMonth();1
		var time=date.toLocaleTimeString();
		var dateDayYear=date.getDate()+'/'+month+'/'+date.getFullYear();
		var timeDate = time+' '+dateDayYear;
		//return timeDate;
		return time;
    }


	function check(event)
	{
		var x=event.which || event.keyCode;

		if(x==13)
		{
			send_message();
		}
		setTimeout(refresh1,5000);
	}
   
	
   
	function refresh1()
	{
		//document.getElementById('status').innerHTML="Idle";
	}
	
	function handle(option){
		displayOutgoingMessage(option);
			apiCall(option);
	}
	
  var timeOut;
  var messageInDiv = "";
	function send_message( message )
	{   

		
		if(null == message){
			messageInDiv=document.getElementById('demo').value;
			document.getElementById('demo').value='';
		}else{
			messageInDiv = messageInDiv + message+" ";
			
		}

		if( messageInDiv )
		{
			// Display outgoing message
			displayOutgoingMessage( messageInDiv );

			/*if(medium.connected){
				emitTextMessageInSocket(medium, messageInDiv);
			}else{
				displayIncomingMessage(errorMessage);
				$("#demo").attr("placeholder", "Say Something ...");
			}*/
	
		
		window.clearTimeout(timeOut);
		timeOut = window.setTimeout(function(){
					apiCall(messageInDiv);
				}, 5000);	
	}
	
	 }
	 
	 function apiCall(messageInDiv){
		 var text = messageInDiv;
		$.ajax({
        type: "POST",
        url: baseUrl + "query",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
          "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({query: text, lang: "en", sessionId: "yaydevdiner"}),

        success: function(data) {
          
		  displayIncomingMessage(data.result.speech);
				$("#demo").attr("placeholder", "Say Something ...");
        },
        error: function() {
          displayIncomingMessage(messageInternalError);
        }
      });
			
			
			
			//displayIncomingMessage("test");
		}
	function send_message_voice(message)
	{   
		if( message)
		{
			// Display outgoing message
			displayOutgoingMessage( message);

			if(medium.connected){
				emitTextMessageInSocket(medium, message);
				$("#demo").attr("placeholder","Jarvis is responding ...");	
			}else{
			   displayIncomingMessage(errorMessage);
			}
		}
	}

    function hideOne1()
    {
		$.get("/loginAuth", function(data){
		  //console.log("something happened on page load ajax"+ data );
		})
		$("#start").css({"width":"0px", "margin-bottom": "21px"});
		$("#chatBox").hide();
		$("#chatBoxextend").hide();
    }
      

	function chatWindowMinimize(){
		$("#start").css("margin-bottom","40px")
		$("#chatBox").hide();
		$("#chatBoxextend").hide();
		$("#header").hide();
		$("#chatbot-img").show();
	}   
		
	// Open chat window	  
	function openChat()
	{   pageLoad = pageLoad + 1;
	    alert(pageLoad);
		var welcomeMessage='Hi ' +username +'. I am Jarvis. Your personal banking advisor. %% Will be glad to assist for any help required on money transfer.';

		var welcomeString = $('#chat span').html();
		if(welcomeString !== undefined && welcomeString.indexOf(welcomeMessage)===-1){
			displayIncomingMessage(welcomeMessage);
		}else if(welcomeString === undefined){
			displayIncomingMessage(welcomeMessage);
		}
											
		$("#start").css({ "width": "450px" , "margin-left": "910px","height":"45px"});
		$("#start").html("<table id='chatBoxHeader' border='0'><tr width = '350px' height = '40px'><td><div id='header'><img src='images/message.png' height='30px' width='30px'></td></div><td style='vertical-align: top'><div id='changeText'><div id='chat_heading'><font color='white' size='3px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font><font color='white' size='2px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><span id='chatWindowMaximize' style='font-size: 25px'>-</b></font></div></td></div></tr></table>");				$("#start").html("<table id='chatBoxHeader' border='0'><tr width = '450px' height = '40px'><td><div id='header'><img src='images/message.png' height='30px' width='30px'></td></div><td style='vertical-align: top'><div id='changeText'><div id='chat_heading'><font color='white' size='3px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font><font color='white' size='2px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><span id='chatWindowMaximize' style='font-size: 25px'>-</b></font></div></td></div></tr></table>");
		$("html, body").animate({ scrollTop: $(document).height() },1200); 
		$("#start").css("margin-bottom","391px");
		$("#chatBox").show();
		$("#chatBoxextend").show();
		$("#chatbot-img").hide();
		$("#header").show();
	}
	  
	  // Display the incoming message
	function displayIncomingMessage(message){
		// Check whether the message has multiple utterances which should be seperated into ballons
		// The delimiter is XX 
		var res = message.split("%%");
		// If not null and length is  > 0
		if(null != res && res.length > 0){
		 
			for(i=0; i < res.length ; i++ ){
			  // Set time out of 2 seconds between each message
			  setTimeout(displayIncomingMessageHtml , (i+1) * 1000, res[i]);
			}
		}   	 
    }
	
	// Display the HTML for the incoming message
	function displayIncomingMessageHtml(message){
		// Show the new Div 
		$("#chat").append("<table border='0'><tr><td><div style='margin-left: 100px; margin-right: 5px;  margin-bottom:15px; box-shadow: 1px 1px 4px; background-color: #d0eaea; padding: 8px; word-wrap: break-word; width: 170px; border-radius: 5px 5px 5px 5px'><span><b><font color='#4483c4' face='arial'>Teacheron - </font></b>&nbsp;&nbsp;&nbsp;<font size='1px' color='#727272'>" + getTimeDate() + "</font><br> <font color='#333333' face='timesnewroman'>"+ message +"</font></span></div></td><td style='vertical-align: top'><img src='images/bot.png' height='40px' width='40px' style='margin-bottom: 15px; margin-right:20px;'></td></tr></table>");		//responsiveVoice.speak(message);
        var objDiv = document.getElementById("chat");
        objDiv.scrollTop = objDiv.scrollHeight;	

	}
	// Display the incoming message
	function displayOutgoingMessage(message){     
		//$("#chat").append("<table border='0'><tr><td style='vertical-align: top'><img src='images/"+gender+".png' height='45px' width='45px' style='margin-bottom: 15px'></td><td><div style=' margin-bottom:15px; word-wrap: break-word; box-shadow: 1px 1px 4px; padding:8px; background-color: #f7e5c9; width: 207px; border-radius: 5px 5px 5px 5px'><span><b><font color='#b61c1c' face='arial'>"+username+ "-</font></b>&nbsp;&nbsp;&nbsp;<font size='1px' color='#727272'>"+ getTimeDate() +"</font><br> <font face='arial' color='#333333'>"+ message +"</font></span></td></tr></table></div>");
		
		$("#chat").append("<table border='0'><tr><td style='vertical-align: top'><img src='images/MALE.png' height='45px' width='45px' style='margin-bottom: 15px'></td><td><div style=' margin-bottom:15px; word-wrap: break-word; box-shadow: 1px 1px 4px; padding:8px; background-color: #f7e5c9; width: 170px; border-radius: 5px 5px 5px 5px'><span><b><font color='#b61c1c' face='arial'>You - </font></b>&nbsp;&nbsp;&nbsp;<font size='1px' color='#727272'>"+ getTimeDate() +"</font><br> <font face='timesnewroman' color='#333333'>"+ message +"</font></span></td></tr></table></div>");
		
		var objDiv = document.getElementById("chat");
		objDiv.scrollTop = objDiv.scrollHeight;
		$("#demo").attr("placeholder","Jarvis is typing.....");
    }

	function userVoiceOutput(data){
		send_message_voice(data);
	}
	
	function startVoiceRecording(){
                                           
		console.log('Browser is recording..........');
		$("#record_button").attr("onclick","endOfVoiceRecording()");
		$("#demo").attr("placeholder","Recording.....");
		startRecording();
		micRecord = 'true';
                                          
    }

    function endOfVoiceRecording(){
		console.log('Browser has  stopped recording..........');
		$("#record_button").attr("onclick","startVoiceRecording()");
		stopRecording();
		micRecord = 'false';
		$("#record_button").css("visibility","hidden");
    }