var decode = require('decode-html');

/*
var bodyData = '<p>Dear Customer,</p><p>Please click the clink below to complete your transaction.</p><p></p><p><a href="http://localhost:4200?link=DSPEKYC&amp;orderno=::ORDER_NO::" title="Click here">Click here to complete the transaction</a></p><p></p><p>Regards,</p><p>Zain Team</p>'
      bodyData:'<p>Dear Customer,</p><p>Please click the clink below to complete your transaction.</p><p></p><p><a href="http://localhost:4200?link=DSPEKYC&amp;orderno=123"          title="Click here">Click here to complete the transaction</a></p><p></p><p>Regards,</p><p>Zain Team</p>'

var array = bodyData.split("::");
console.log("array:", array, " array.length:", array.length);


array[1] = "123";
bodyData = array.join("");
console.log("bodyData:", bodyData);

var param = "ORDER.NO";

var n = param.includes(".");

console.log( "n:" , n);
*/

/*
var text = "Dear Customer, "
		+"Please click the clink below to complete your transaction."
		+ '"http://localhost:4200?link=DSPEKYC&orderno=233&status=0"'
		+ "Regards,"
		+ "Zain Team";
var ptr1  = text.indexOf('"http');
console.log ("ptr1:",ptr1);
if (ptr1 != -1)
{
	var part1 = text.slice(0,ptr1+1);
	var part2 = text.slice(ptr1+1);
	console.log ("part1:",part1, " part2:", part2);

	var ptr2  = part2.indexOf('"');
	if (ptr1 != -1)
	{
		console.log ("ptr2:",ptr2);
		var url = part2.slice(0,ptr2);
		var part3 = part2.slice(ptr2);
		console.log ("url:",url, " part3:", part3);

		var array = url.split("?");
		console.log("array:", array);

		var buff = Buffer.alloc(array[1].length, array[1]);
		//let buff = new Buffer(array[1]);
		let base64data = buff.toString('base64');

		array[1] = base64data;

		let data = base64data;
		let buff1 =  Buffer.alloc(data.length, data, 'base64');
		let text = buff1.toString('ascii');
		console.log("text:",text);

		console.log("array:", array);
		url = array.join("?");
		console.log("url:",url);

		text = part1 + url + part3;

		console.log("text:",text);

	}

}
*/

/*
var fullURL = "http://localhost:4200?link=DSPEKYC&orderno=233&status=0";

var array = fullURL.split("?");
console.log("array:", array);

var buff = Buffer.alloc(array[1].length, array[1]);
//let buff = new Buffer(array[1]);
let base64data = buff.toString('base64');

array[1] = base64data;

console.log("array:", array);
fullURL = array.join("?");
console.log("fullURL:",fullURL);

*/
/*
	function htmlDecode(value){
	  "use strict";
	  //value = value.html(value).text();
	  var buff1 = Buffer.alloc(value.length, value, 'html');
	}

var url = "http://localhost:4200?link=DSPEKYC&amp;orderno=321&amp;status=0&amp;step=1";
url = decode (url);
console.log("url:", url);

*/

var paramData ="Order :ORDER_NO completed successfully"
var queryData = {
  WO_TYPE: 'NOTIFY',
  WO_ORDER_NO: '336-6',
  SUBNO: '00201002251626',
  WO_STATUS: 20,
  DIV: '',
  DEPT: '',
  ASSIGNEE_TYPE: 'API',
  ASSIGNEE: 'TABS',
  PROMISED_DATE: '2020-12-17T13:56:48.229Z',
  ORDERED_DATE: '2020-12-15T13:56:48.229Z',
  COMPLETION_DATE: null,
  NOTES: '',
  PARENT_WO_ORDER_NO: '336-6',
  ORDER_NO: '336',
  ACTUAL_START_DATE: '2020-12-15T17:48:50.267Z',
  ATTACHMENTS: '',
  ACTUAL_END_DATE: null,
  LOGDATE: '2020-12-15T13:56:48.337Z',
  LOGNAME: 'ekyc',
  TEMPLATE_NAME: 'Purchase Roaming',
  TEMPLATE_ORDER: 6,
  _QUERY: 'UPDATE_DSP_WORK_ORDERS',
  ORDER_FIELDS: '{"data":{"NAME":"Fuad","EMAIL":"fuadks@gmail.com","ITEMS":"Roaming","PAYMENT":true,"QTY":"1","VAT":"info","TEXT_AREA1":"some comment","NAME2":"Fuad Kamal","SECRET":"123","CARDNO":"123456","EXDAY":"11","EXYEAR":"21"}}'
};


	function getElmValue(paramData, queryData)
	{

		function getORDER_FIELDSData(param,orderFields)
		{
			var val = "";
			var array = param.split(".");
			var fieldName = array[1];
			console.log("fieldName:",fieldName);
			orderFields = JSON.parse(orderFields);
			console.log("orderFields:",orderFields);
			var fieldsData = orderFields.data;
			val = fieldsData[fieldName];
			return val;
		}

		var val = paramData;

		var n = paramData.search(":");
		if (n != -1)
		{
			var array = paramData.split(":");
			for (var i = 0; i < array.length; i++)
			{
				if (i != 0)
				{
					var n = array[i].search(" ");
					console.log( "n:" , n , "array[i]:", array[i]);
					if (n == -1)
						n = array[i].length;
					if (n != -1)
					{
						var param = array[i].slice(0, n);
						param = param.trim();
						console.log("param:"+param);

						var n = param.includes(".");
						console.log( "n:" , n);
						if (n == true){
							val = getORDER_FIELDSData(param,queryData.ORDER_FIELDS);
						}
						else
							val = queryData[param];
						if (typeof val == "string")
							val = val.trim();
						console.log("param:" , param, " val:", val );
						
					}
				}
			}
		}
		if (typeof val == "string")
			val = val.split("'").join("");
		return val;
	}
	var param ="subject";

	//paramData = getElmValue (paramData, queryData);
	//console.log("-----------------------------param:", param, " paramData:", paramData);
//-------------------------

   function isDate (value) {
		var valueIso = "";
		var status = false

		var valueIso = new Date(value);//.toISOString();
		if (valueIso != "Invalid Date")
		{
			valueIso = valueIso.toISOString();
			console.log("---valueIso:", valueIso, " value:", value);
			
			if (value == valueIso)
				status = true;
		}
		return status;
    }
	function formatIfDate(value)
	{
		var newVal = value;
			
		if (isDate (value))
		{
			value = new Date(value);
			value = value.toISOString();
			var array = value.split(".")
			var array1 = array[0].split("T")
			newVal = array1.join(" ")
		}
		return newVal;
	}

	//var value = "2020-12-27T09:20:39.959Z";
	//var value = "123";
	
	//var value = "hello";
	//value = formatIfDate(value);
	//console.log("value:" + value+":");

	var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.cert', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
