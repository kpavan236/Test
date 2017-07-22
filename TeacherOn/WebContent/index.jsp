<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>

<!DOCTYPE HTML>
<html>
	<head>
	<link rel="icon" href="images/MosaicLogo.png">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta http-equiv='Content-Type' content='text/html;charset=UTF-8'/>
		
		<script src="js/jquery.min.js"></script>		
		<script src="js/bootstrap.min.js"></script>		
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<script src="js/socket.io.js"></script>
		<link rel="stylesheet" href="css/Demo.css">
		
		<!-- Please include the channel specific JS file here -->
		<script src="js/guid.js"></script>
		<script src="config/config.js"></script>
		
		<script src="js/Demo.js"></script>
		<script src="js/text-channel.js"></script>
		<link rel="stylesheet" href="css/w3.css">
		<link rel="stylesheet" href="css/jarvis-voice-style.css">

		<script src="resources/sap-ui-core.js"
				id="sap-ui-bootstrap"
				data-sap-ui-libs="sap.m, sap.ui.layout"
				data-sap-ui-theme="sap_belize"
				data-sap-ui-xx-bindingSyntax="complex">
		</script>
		<!-- only load the mobile lib "sap.m" and the "sap_bluecrystal" theme -->

		 <link rel="stylesheet" type="text/css" href="css/custom.css">
		<script>
				var approver_GUID = "";
				var SERVER = "";
				var selectedKey = null;
				var tenantID = null;
				var solrQuery = null;
				sap.ui.localResources("selfhelp_pages");
				var overview_VIEW = null;
				var home_VIEW = null;
				var search_VIEW = null;
				var report_VIEW = null;
				var approver_VIEW = null;
				var author_VIEW = null;
				var display_VIEW = null;
				var oModel_Chart = null;
				var oModel_Detail = null;
				var oModel_Module = null;
				var oModel_usage = null;
				var regionreport_MODEL = null;
				var arrayOut = [];
				var searchDataCopy=null;
				var ReftenaID=null;
				var statusmail=null;
				
				var indicator=null;
				var tenaSolrq=null;
				
				
				var username=null;
				var gender = null;
				var objectId = null;
				
                 var Doc_Value = "<%=request.getParameter("DOC_DESC")%>";
                 var tenantID= "<%=request.getParameter("TenaID")%>";
                 
            
                 
				<% if(request.getParameter("DOC_DESC") != null && request.getParameter("TenaID") != null) {%>
				var app = new sap.m.App({id:"ID_A_SH",initialPage:"ID_P_SRESULT"});
				
				
				<%}
				else{
				%>
				var app = new sap.m.App({id:"ID_A_SH",initialPage:"ID_P_HOME"});
				<%}
				
				%>
				
				
				
				
				page = sap.ui.view({id:"ID_P_OVER", viewName:"selfhelp_pages.Overview", type:sap.ui.core.mvc.ViewType.XML});
				app.addPage(page);
				
				page = sap.ui.view({id:"ID_P_HOME", viewName:"selfhelp_pages.Home", type:sap.ui.core.mvc.ViewType.XML});
				app.addPage(page);
				
				page = sap.ui.view({id:"ID_P_SRESULT", viewName:"selfhelp_pages.SearchResult", type:sap.ui.core.mvc.ViewType.XML});
				app.addPage(page);
				
				page = sap.ui.view({id:"ID_P_REPORT", viewName:"selfhelp_pages.Report", type:sap.ui.core.mvc.ViewType.XML});
				app.addPage(page);
				
				page = sap.ui.view({id:"ID_P_APPROVER", viewName:"selfhelp_pages.Approver", type:sap.ui.core.mvc.ViewType.XML});
				app.addPage(page);
				
				page = sap.ui.view({id:"ID_P_AUTHOR", viewName:"selfhelp_pages.Author", type:sap.ui.core.mvc.ViewType.XML});
				app.addPage(page);
				
				page = sap.ui.view({id:"ID_P_DISPLAY", viewName:"selfhelp_pages.Display", type:sap.ui.core.mvc.ViewType.XML});
				app.addPage(page);
				
				app.placeAt("content");
		</script>

	</head>
			<!-- <body class="sapUiBody" role="application"> -->
		
				<body class="sapUiBody" onload='chatWindowMaximize()' role="application">
		
		
	<div id='two'>
   <div id='start' onclick='chatWindowMaximize()' style='height:0px;'>

   
   </div>
   <div id='chatBox'>
   <div id='chat'></div>
   </div>
  <div id='chatBoxextend'>
   <div>
		<div id="inputTextArea">
			<input type='text' style='font-size: large;' placeholder="Say Something ..." onkeypress='check(event)' id='demo'>
			<img src='images/play-5-24.png' id='button1' onclick='send_message()'></img>
		</div>
   </div>
   </div>
 </div>
		
		
		
		<script>
		 var a=1;
		 
		/*  var username="Athul"; */
		   function chatWindowMaximize(){  

				roomidfunction(objectId);
		        
				pageLoad = pageLoad + 1;
			    //alert(pageLoad);
	
				
				if(a==1)
					{
						var welcomeMessage = 'Welcome to Adient helpdesk ' +username +' . How can I help you today?';		                
						
			            var welcomeString = $('#chat span').html();
			            
						if(1 == pageLoad){
													
							
							if(welcomeString !== undefined && welcomeString.indexOf(welcomeMessage)===-1){
				                    displayIncomingMessage(welcomeMessage);
				            }else if(welcomeString === undefined){
				                    displayIncomingMessage(welcomeMessage);
				            }
							
							}
							$("#start").css({ "width": "452px","margin-left": "872px","height":"47px","background-color": "#434347","margin-bottom": "389px"});
							$("#start").html("<table id='chatBoxHeader' border='0'><tr width = '350px' height = '40px'><td><div id='header' style='margin-top:-210px;'><img src='images/message.png' height='35px' width='30px' margin-top='9px'></td></div><td style='vertical-align: top'><div id='changeText'><div id='chat_heading'><font color='white' face='arial' size='4px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Jarvis SAP Chat</font><font color='white' size='2px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><span id='chatWindowMaximize' style='font-size: 25px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-</b></font></div></td></div></tr></table>");					$("#start").html("<table id='chatBoxHeader' border='0'><tr width = '450px' height = '45px'><td><div id='header' style='margin-top:-210px'><img src='images/message.png' height='35px' width='30px' margin-top= '9px'></td></div><td style='vertical-align: top'><div id='changeText'><div id='chat_heading'><font color='white' face='arial'size='3px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Jarvis SAP Chat</font><font color='white' size='2px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><span id='chatWindowMaximize' style='font-size: 25px; line-height:1em'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-</b></font></div></td></div></tr></table>"); 
					 		  
							$("html, body").animate({ scrollTop: $(document).height() }, 1200); 
							$("#start").css("margin-bottom","389px");
							$("#chatBox").show();
							$("#chatBoxextend").show();
							$("#chatbot-img").hide();
							$("#chatBoxHeader").show();
							a--;
				        }
				        else if(a==0)
				        {
							$("#start").css({"width":"0px", "margin-bottom": "21px", "margin-left" : "1250px"});
							$("#chatbot-img").show();
							$("#chatBox").hide();
							$("#chatBoxextend").hide();
							$("#chatBoxHeader").hide();
							a++;
				        }	        
		
				      }	
		  
		</script>


		<div id="content"></div>
		 <div class="start" id="start">
		<img class="chatbot-img" id="chatbot-img" src="images/chat.png" onclick='chatWindowMaximize()' >
		
		 <div id='chatBox'>
			<div id='chat'></div>
		</div>
		<div id='chatBoxextend'>
			<div>
				<div id="inputTextArea">
					<input type='text' style='font-size: large;' placeholder="Say Something ..." onkeypress='check(event)' id='demo'>
					<img src='images/play-5-24.png' id='button1'></img>
				</div>
			</div>
		</div> 
	</div> 
	<script>
	debugger;
	document.getElementById('chatbot-img').style.visibility='hidden';
	if(self.window.name == "jarvis"){
		document.getElementById('chatbot-img').style.visibility='visible';
		document.title = 'Jarvis';
	}else{
		$('#start').remove();
		$('#start').remove();
		$('#chatBoxextend').remove();
		$('#inputTextArea').remove();
		$('#chatBox').remove();
		document.title = 'Self-Help';
	}
	
	
	</script>
	
	</body>
</html>