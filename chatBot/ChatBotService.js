var express = require("express")
var ejs = require('ejs')
var app = express()

app.set('view engine', 'ejs')

app.get('/chatBotApp', function(req, res) {
	res.render('chatWindow')
})

var msqlm = require('./Utilities/MySQLManager.js');


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/procMsg', function(req, res) {
		console.log(req.headers);
				
		if(req.headers.action == 'email_action'){
			spokenResponse = req.headers.speech;
			
			msqlm.executeQuery("insert into emailIds values(?)",req.headers.resolvedquery, function(){})
			
			
			res.send({"res":req.headers.speech});
		} else {
			spokenResponse = req.headers.speech;
			res.send({"res":req.headers.speech});
		}
		
})



var port = process.env.PORT || 8080
app.listen(port, function() {
	console.log('Node.js listening on port ' + port)
})