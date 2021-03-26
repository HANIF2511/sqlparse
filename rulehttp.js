var logging = require("./logging.js")
var translog = require("./translog.js")
var users = require("./users.js")
var xsltmap = require("./xsltmap.js")
var rulefunc = require("./rulefunc.js")

var http = require('http');
var request = require('sync-request');
module.exports = {
		sendToServer : function(db, req, actionsArr, queryData, rule,action, Trigger,  hostsArr, hostsMapArr)
		{
//console.log ("-----****---:actionsArr:",actionsArr," queryData :", queryData," rule:", rule , " action:" ,action, " Trigger:",Trigger, "  hostsArr:",hostsArr," hostsMapArr:",hostsMapArr);

			function extractStatus (ruleLog, msgResponse)
			{
				successMsg = ruleLog.hostDef.SUCCESS_MSG;
				console.log("-------msgResponse:" ,  msgResponse, successMsg);
				var array = successMsg.split(":");
				var field = array[0];
				var value = array[1];

				var msgResponseArr = JSON.parse(msgResponse);
				console.log( "field:", field, " value:", value, " msgResponseArr:", msgResponseArr);
				console.log("-------msgResponseArr[field]:" ,  msgResponseArr[field], value);
				var status = 1;
				if (msgResponseArr[field] == value)
					status = 0;
				return status;
			}

			function  handleResponseEnd(ruleLog, msgResponse){
				var status = extractStatus (ruleLog, msgResponse);
				rulefunc.LogRule(ruleLog, msgResponse, status);

			
				//	.RULE_ID + "," +  action.ACTION_ID + "," + users.getUserName() + ","  + dateIso;
				console.log("-------handleResponse:status:" ,  status);
			}


		var handleResponse = function(response,  ruleLog){
		  var msgResponse = ''
		  response.on('data', function (chunk) {
			msgResponse += chunk;
		  });
		  response.on('end', function () {
			 handleResponseEnd(ruleLog, msgResponse);
 		  });

		}






		function sendSync(method, host, port, path,bodyToSend,  parametersToSend,  ruleLog,  options1,var1) 
		{
					console.log("---------------insid sendSync:methodL",method,host, port, path, parametersToSend,  ruleLog,  options1,var1);
						var msgResponse = ''
						var reqNew = http.request(optionsGlob, (response) => {
							let chunks_of_data = [];

							/*response.on('data', (fragments) => {
								chunks_of_data.push(fragments);
							});*/
							  response.on('data', function (chunk) {
								 console.log("chunk:", chunk);
								msgResponse += chunk;
							  });
							/*
							response.on('end', () => {
								let response_body = Buffer.concat(chunks_of_data);
								
								// promise resolved on success
								resolve(response_body.toString());
							});
							*/
						  response.on('end', function () {
  							 console.log("msgResponse:", msgResponse);
							 handleResponseEnd(ruleLogGlob, msgResponse);
						  });


							response.on('error', (error) => {
								// promise rejected on error
								// Handle error
								error = err;
								msg = "Error sending to Host :" +sendTo ;
								console.log( msg + " Error:" + err );
								rulefunc.LogRule(ruleLogGlob, msg + " Error:" + err, 400 );
								reject(error);
							});
						});
						console.log("here1:",bodyToSendGlob);
						reqNew.write(bodyToSendGlob);
						console.log("here2");
						reqNew.end();
						console.log("here3");
		/*
					status = 1;
					var headers  =  {headers:options1.headers};
					console.log("headers:", headers);
					var url = "http://" + host + ":" + port  + path + parametersToSend ;
					console.log("---url:", url);
					if (method == "GET")
					{
						var res = request(method, url, headers);
						var result = JSON.parse(res.getBody('utf8'));	
					}
					else
					if (method == "POST")
					{
						var dataForSync = { json : bodyToSend, headers:options1.headers};
						var res = request(method, url, dataForSync);
						var result = JSON.stringify(JSON.parse(res.getBody('utf8')));	
						console.log("result:" +  result);

					}
					var status = extractStatus (ruleLog, result);
					LogRule(ruleLog, result, status );
					error = status;
					if (status != 0)
						msg = result;
					var statusRec ={
							status : error,
							msg : msg
					};
*/
					return statusRec;


		}

		function asyncCall(method, host, port, path, bodyToSend,parametersToSend,  ruleLog,  options1){
			return new Promise( (resolve,reject)=>{
				console.log("---------------insid asyncCall:method:",method,host, port, path, parametersToSend,  ruleLog,  options1);
		//	 sendSync(method, host, port, path, parametersToSend,  ruleLog,  options)==> (resolve());
				var var1= "x";
			     sendSync( method, host, port, path,bodyToSend,  parametersToSend,  ruleLog,  options1, var1 =>{
					resolve({})
				 })
				 
			})
		}
									
		async function todo(method, host, port, path, bodyToSend, parametersToSend,  ruleLog,  options){
			try {
				console.log('------------command1')
				console.log('--------command2')
				console.log('------call async:method:',method)
				await asyncCall(method, host, port, path, bodyToSend, parametersToSend,  ruleLog,  options)
				console.log('-----------proceed')
				}
				catch(error) {
					// Promise rejected
					//reject(error);
					console.log(error);
				}

		}

////////////////
	
		function getHost(sendTo,hostsArr)
		{
			var i =0;
			while ( i < hostsArr.length)
			{
				console.log("-----------hostsArr[i].HOST_ID :", hostsArr[i].HOST_ID  , " sendTo:", sendTo);
				if (hostsArr[i].HOST_ID == sendTo)
					return hostsArr[i];
				i++;
			}
			return null;

		}
		function getHostMap(hostDef, mapID,hostsMapArr)
		{
			var i =0;
			console.log("-----------mapID:", mapID  , " hostDef.MAP_ID:", hostDef.MAP_ID);
			if ( (mapID != null) && (mapID != "") )
			{
				while ( i < hostsMapArr.length)
				{
					if ( ( hostsMapArr[i].HOST_ID == hostDef.HOST_ID) && (mapID == hostsMapArr[i].MAP_ID) )
						return hostsMapArr[i];
					i++;
				}
			}
			return null;

		}
function hexdump(buffer, blockSize) {
    blockSize = blockSize || 16;
    var lines = [];
    var hex = "0123456789ABCDEF";
    for (var b = 0; b < buffer.length; b += blockSize) {
        var block = buffer.slice(b, Math.min(b + blockSize, buffer.length));
        var addr = ("0000" + b.toString(16)).slice(-4);
        var codes = block.split('').map(function (ch) {
            var code = ch.charCodeAt(0);
            return " " + hex[(0xF0 & code) >> 4] + hex[0x0F & code];
        }).join("");
        codes += "   ".repeat(blockSize - block.length);
        var chars = block.replace(/[\x00-\x1F\x20]/g, '.');
        chars +=  " ".repeat(blockSize - block.length);
        lines.push(addr + " " + codes + "  " + chars);
    }
    return lines.join("\n");
}

/////////////////
		function performHttpPost (db, req, bodyToSend, parametersToSend, sendTo, queryData, rule,action, Trigger, hostDef,hostMapDef,  headerParam)
		{

			var	valid = false;
			var error = 0;
			var msg = "";

			var options = {
			  host: '',
			  path: '',
			  port: 80,
			  method: 'POST',
			  headers: {
			  'Content-Type': 'application/json',
			   //'Content-Type': 'text/xml; charset=utf-8',
			  "authorization": ""
			  }
			};

			console.log("---------------req.url:",req.url);
			console.log("---------------pathname:",req._parsedUrl.pathname);
			console.log("---------------path:",req._parsedUrl.path);
			var d = new Date();
			var dateIso = d.toISOString();
			if (hostDef == null)
				hostDef = "";

			var ruleLog = {
				rule : rule,
				action : action,
				queryData : queryData,
				bodyToSend : bodyToSend,
				parametersToSend : parametersToSend, 
				"db": db,
				sentDate : dateIso,
				hostDef : hostDef
			};
			if (sendTo == "WF")
			{
				var host = req.headers.host;
				var array = host.split(":");
				host = array[0];
				var port = 80;
				if (array[1]  != "")
					port = array[1];
				var path = req._parsedUrl.path;
				var authorization = req.headers.authorization;
//host ="192.168.1.3"
//port ="8091"
				options.host = host;
				options.port = port;
				options.path = path;
				options.headers.authorization = authorization;
				
				valid = true;
				
			}
			else
			{
				if (hostDef != "")
				{
					var path = "/" + hostDef.PATH;
					if (parametersToSend != "")
						path = path + parametersToSend ;
					var host = hostDef.HOST;
					var port =  parseInt(hostDef.PORT);
					var method = hostDef.HTTP_METHOD;

					options.host = host;
					options.port = port;
					options.path = path;
					options.method = method;
			       // var url = "http://" + host + ":" + port  + path + parametersToSend ;
			       var url  = hostDef.URL ;

//					options.headers.authorization = req.headers.authorization;
					//bodyToSend = "";


					valid = true;
				}
				else
				{
					error = 100;
					msg = "undefined Host :" +sendTo;
					rulefunc.LogRule(ruleLog, msg , 100);
				}
			}
console.log("here2:valid:", valid);
			if (valid)
			{
				console.log("options:",options);
				console.log("------bodyToSend:" + bodyToSend, "  Trigger:", Trigger);

				var keys = Object.keys(headerParam);
				for (var i =0; i < keys.length; i++)
				{
					console.log( keys[i] + " " + headerParam[ keys[i] ] ) ;
					if (headerParam[ keys[i] ] != null)
					{
						options.headers[keys[i]] = headerParam[ keys[i] ];

						//screenConfig[ keys[i] ] = componentConfig[ keys[i] ];
					}
				}


				if (action.ACTION_CODE == "SEND_WAIT")
				{
					var sendingLib = "request";
					status = 1;
					var headers  =  {headers:options.headers};
					console.log("headers:", headers);
					var url = "http://" + host + ":" + port  + path + parametersToSend ;
					console.log("---url:", url);
					if (method == "GET")
					{
						var res = request(method, url, headers);
						var result = JSON.parse(res.getBody('utf8'));	
					}
					else
					if (method == "POST")
					{

						var dataForSync = { body : bodyToSend, headers:options.headers};
						var res = request(method, url, dataForSync);
						console.log("res:", res);
						var statusCode = res.statusCode;
						var msgResponse ="";
						if (statusCode == 200)
						{
							var contentType = res.headers['content-type'];
							
							var msgResponse = res.getBody('utf8');
							console.log("statusCode:", statusCode," headers:", headers,  " msgResponse:", msgResponse);
							var n = contentType.search("json");
							if (n != -1)
								var result = JSON.stringify(JSON.parse(msgResponse));	
							else
								var result = msgResponse;
							console.log("result:" +  result);
						}
						else
						{
							error = statusCode;
							var msgResponse = res.body.toString();
							msg = msgResponse;
						}

					}
					if (error == 0)
					{
						if ( (hostMapDef != null) &&  (hostMapDef.XSLT_RECEIVE != null) && (hostMapDef.XSLT_RECEIVE != "") )
						{
							{
								result = xsltmap.mapDataOut(result, hostMapDef.XSLT_RECEIVE);
								console.log("result:", result);
								
							}
						}

						var status = extractStatus (ruleLog, result);
						rulefunc.LogRule(ruleLog, result, status );
						error = status;
						if (status != 0)
							msg = result;
					}
					
					


				}
				else
				{
					//async
					var reqNew = http.request(options, function(response){ handleResponse(response,  ruleLog); }); 
					reqNew.on('error', function(err) {
						// Handle error
						error = err;
						msg = "Error sending to Host :" +sendTo ;
						console.log( msg + " Error:" + err );
						rulefunc.LogRule(ruleLog, msg + " Error:" + err, 400 );
					});

					console.log("here1");
					reqNew.write(bodyToSend);
					console.log("here2");
					reqNew.end();
					console.log("here3");
				}

			}
			var statusRec ={
				status : error,
				msg : msg
			};

			/*var status = 1;
			if (!valid){
				statusRec.status = 1;
				statusRec.msg = 
			}*/
			console.log("valid:", valid, " status:", statusRec);

			return (statusRec);

		}

////////////////////			
			console.log("****************actionsArr1:", actionsArr);
			var error =0;
			var msg = "";
			var statusRec ={
			  status : error,
			  msg : msg
			};
			var sendTo = actionsArr.SEND_TO;
			var qryParam = {};
			var headerParam ={};
			var bodyToSendArr = [];
			var bodyToSend = "";
			var parametersToSend = "";
			var hostDef = getHost(sendTo,hostsArr);
			var hostMapDef = getHostMap(hostDef, action.MAP_ID,hostsMapArr);
			console.log("hostMapDef:", hostMapDef);

			console.log("****hostDef.HEADER:", hostDef.HEADER);

			if ( (hostDef.HEADER != null) && (hostDef.HEADER != "") )
			{
				var array = hostDef.HEADER.split("\n");
				console.log("array:", array, " array.length:", array.length);

				for (var i = 0; i < array.length; i++)
				{
					var elem = array[i];
					var arrayParam = elem.split(":");
					var param = arrayParam[0];
					param = param.trim();
					var paramData = arrayParam[1];
					paramData = paramData.trim();
					console.log("paramData:", paramData);
					paramData = rulefunc.getElmValue (paramData, queryData);
					console.log("-----------------------------param:", param, " paramData:", paramData);
					headerParam[param] = paramData;
				}
			}



			if ( (actionsArr.BODY_DATA != null) && (actionsArr.BODY_DATA != "") )
			{
				var bodyData = actionsArr.BODY_DATA;
				console.log("bodyData:", bodyData);
				var array = bodyData.split(",");
				console.log("array:", array, " array.length:", array.length);

				for (var i = 0; i < array.length; i++)
				{
					var elem = array[i];
					var arrayParam = elem.split("=");
					var param = arrayParam[0];
					param = param.trim();
					var paramData = arrayParam[1];
					paramData = paramData.trim();
					console.log("paramData:", paramData);
					paramData = rulefunc.getElmValue (paramData, queryData);
					console.log("-----------------------------param:", param, " paramData:", paramData);
					qryParam[param] = paramData;
				}
				console.log("qryParam:here");
				console.log("qryParam:", qryParam , " qryParam.length :", Object.keys(qryParam).length);
				bodyToSendArr.push(qryParam);
				console.log("---hostDef:", hostDef);//fuad

				if (bodyToSendArr.length != 0)
				{
					if ( (hostMapDef != null) &&  (hostMapDef.XSLT_SEND != null) && (hostMapDef.XSLT_SEND != "") )
					{
						{
							bodyToSend = xsltmap.mapData(bodyToSendArr, hostMapDef.XSLT_SEND);
							
						}
					}
					else
					{
						bodyToSend = JSON.stringify(bodyToSendArr)
						//bodyToSend = bodyToSendArr
					}
				}
/*
var hexout = hexdump(bodyToSend, 16) ;
console.log("hexout:",hexout);
*/
			}
			
			if ( (actionsArr.PARAMETER_DATA != null) && (actionsArr.PARAMETER_DATA != "") )
			{
				var parameterData = actionsArr.PARAMETER_DATA;
				console.log("parameterData:", parameterData);
				console.log("parameterData.length:",parameterData.length);
				

				var array = parameterData.split(",");
				console.log("array:", array, " array.length:", array.length);
				for (var i = 0; i < array.length; i++)
				{
					var elem = array[i];
					var arrayParam = elem.split("=");
					var param = arrayParam[0];
					param = param.trim();
					var paramData = arrayParam[1];
					paramData = paramData.trim();
					console.log("paramData:", paramData);
					paramData = rulefunc.getElmValue (paramData, queryData);
					console.log("-----------------------------param:", param, " paramData:", paramData);
					if (parametersToSend == "")
						parametersToSend = "?" + param + "=" + paramData;
					else
						parametersToSend = parametersToSend + "&" + param + "=" + paramData;
				}
			}

			console.log("bodyToSend:", bodyToSend);
			console.log("parametersToSend:", parametersToSend);
			
			var statusRec = performHttpPost(db,req, bodyToSend, parametersToSend, sendTo, queryData, rule,action, Trigger, hostDef,hostMapDef,  headerParam);			
			console.log("post performHttpPost: status:", statusRec);
			return statusRec;



		}

};
