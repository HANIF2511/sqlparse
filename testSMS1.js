var request = require('sync-request');

function sendSMS(url, to, text,apiKey )
{
	var authorization = "basic " + apiKey;
	var msg = "?to=" + to + "&text=" + text;
	msg = encodeURI(msg);
	var fullURL = url + msg;

	var options = {
	  headers: {
	  //'Content-Type': 'application/json',
	  'Content-Type': 'text/xml; charset=utf-8',
	  "authorization": authorization
	  }
	};



	var headers  =  {headers:options.headers};
	console.log("headers:", headers);
	console.log("fullURL:",fullURL);
	
	var method = "GET";

	var res = request(method, fullURL, headers);
	//console.log("res:" , res);
	console.log ("body:" , res.body.toString()," response:" , res.statusCode);


}

var url = "https://gateway.sms77.io/api/sms";
var to = "00201002251626";
var text = "hello fuad3";
var apiKey = "e420dGYaJziSvSr3v22b2uQ6tuX4qkX8nm53xvurk7bDlvH0gmJFbuGwyF6Kn4Tk";

sendSMS(url, to, text,apiKey );