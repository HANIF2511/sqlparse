// switchapi.js
// ========
var fs = require('fs');
var md5 = require("md5")
var logging = require("./logging.js")
var sqlparse = require("./sqlparse.js")
const config = require('config');
const valifyConfig = config.get('Customer.valifyConfig');
const hostConfig = config.get('Customer.hostConfig');

var http = require('http');
var	  attDir = hostConfig.attDir;

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

		function setOptions(options, req)
		{
			var host = req.headers.host;
			var array = host.split(":");
			host = array[0];
			var port = 80;
			if (array[1]  != "")
				port = array[1];
			var path = "/api?_format=json&_trans=Y";
			var authorization = req.headers.authorization;
			options.host = host;
			options.port = port;
			options.path = path;
			options.headers.authorization = authorization;
			return options;
		}

module.exports = {
    processcommand: function(db, queryData, req, res)
    {

		function setGetTemplateOrderNo(Body, TEMPLATE_NAME)
		{
			var newVal =  {"_QUERY":"GET_DSP_TEMPLATE", "TEMPLATE_NAME" : TEMPLATE_NAME };
			Body.push(newVal);

			newVal =  {"_QUERY":"GET_DSP_TEMPLATE_DETAIL", "TEMPLATE_NAME" : TEMPLATE_NAME, "SEQUENCE" : "%" };
			Body.push(newVal);

			newVal = { "_QUERY": "UPDATE_ADM_DUAL" , "KEY": "ORDER_NO"};
			Body.push(newVal);

			newVal = { "_QUERY": "GET_ADM_DUAL" , "KEY": "ORDER_NO"};
			Body.push(newVal);

			return Body;
		}

		function addOrder(res, db)
		{
			var NewTransno = 1;

				var response = [
								{
								"message": "success",
								"transno": NewTransno
								}];
				res.json(response);

		}
		

		function addDays(date, days) {
			var today = new Date(date);
			var newdate = new Date(date);
			newdate.setDate(today.getDate()+ parseInt(days) );
			//console.log("today:", today, " newdate:", newdate, " days:", days);
		  return newdate;
		}
		function setAddOrder_OrderDetails(Body, receivedData, queryData)
		{
			function calcDuration(templateDetail){
				var durarionNum = 0;
				for (var i = 0; i < templateDetail.length ; i++){
					durarionNum = durarionNum +  parseInt( templateDetail[i].DURATION) ;
				}
				return durarionNum;
			}
			var template = receivedData.data[0].data;
			var templateDetail = receivedData.data[1].data;
			var ORDER_NO = receivedData.data[3].data[0].VAL;

			//console.log("Template:", template);
			//console.log("Template Details:", templateDetail);
			//console.log("ORDER_NO :", ORDER_NO);
			var statement="";
			//console.log("queryData:", queryData);

			/*
			var ORDERED_DATE = sqlparse.getParamData(statement, queryData,'ORDERED_DATE');
			ORDERED_DATE = ORDERED_DATE.split("'").join("");
			var PROMISED_DATE = sqlparse.getParamData(statement, queryData,'PROMISED_DATE');
			PROMISED_DATE = PROMISED_DATE.split("'").join("");
			var SUBNO = sqlparse.getParamData(statement, queryData,'SUBNO');
			SUBNO = SUBNO.split("'").join("");
			var ASSIGNEE = sqlparse.getParamData(statement, queryData,'ASSIGNEE');
			ASSIGNEE = ASSIGNEE.split("'").join("");
			*/
			var Body = [];
			var newVal ={};
			newVal = queryData;

			newVal.ORDER_STATUS = 10;
			newVal.ORDER_NO = ORDER_NO;
			newVal.ORDER_TYPE = template[0].ORDER_TYPE;
			newVal.ASSIGNEE_TYPE = template[0].ASSIGNEE_TYPE;
			if (typeof newVal.ASSIGNEE == "undefined")
				newVal.ASSIGNEE = template[0].ASSIGNEE;
			
			var orderFields = newVal.ORDER_FIELDS;
			if (orderFields != ""){
				orderFields = JSON.stringify(orderFields);
				newVal.ORDER_FIELDS = orderFields;
			}
			var promisedDate = newVal.PROMISED_DATE;
			console.log("====promisedDate:", promisedDate);
			if (typeof promisedDate == "undefined"){
				var promisedDate =  new Date();
				var duration = template[0].DAYS;
				if (duration == 0){
					duration = calcDuration(templateDetail);
				}
				promisedDate = addDays(promisedDate,  duration);

			}
			newVal.PROMISED_DATE = promisedDate;


			newVal["_QUERY"] = "INSERT_DSP_ORDERS" ;

/*			newVal.PROMISED_DATE = new Date(PROMISED_DATE);
			newVal.ORDERED_DATE = new Date(ORDERED_DATE);
			newVal.SUBNO = SUBNO;
			newVal.ASSIGNEE = ASSIGNEE;
			newVal["_QUERY"] = "INSERT_DSP_ORDERS" ;
*/
			Body.push(newVal);
			//console.log("newVal:",newVal, " Body:", Body);


			var promisedDate =  new Date();

			 for (var i = 0; i < templateDetail.length ; i++){
					var workOrder = {};   
					workOrder.WO_ORDER_NO = ORDER_NO + "-" + (i+1);
					workOrder.WO_TYPE =  templateDetail[i].WO_TYPE ;
					workOrder.TEMPLATE_ORDER  =  "" + (i + 1);
					workOrder.TEMPLATE_NAME  =  template[0].TEMPLATE_NAME;
					workOrder.DEPT =  templateDetail[i].DEPT ;
					workOrder.DIV =  templateDetail[i].DIV ;
					workOrder.ASSIGNEE_TYPE =  templateDetail[i].ASSIGNEE_TYPE ;
					workOrder.ASSIGNEE =  templateDetail[i].ASSIGNEE ;
					workOrder.ORDER_NO =  ORDER_NO;
					workOrder.SUBNO =  newVal.SUBNO;
					workOrder.WO_STATUS = 10;
					workOrder.PARENT_WO_ORDER_NO = "";
					if (templateDetail[i].DEPENDANT_WO_ORDER != "")
					  workOrder.PARENT_WO_ORDER_NO = ORDER_NO + "-" + templateDetail[i].DEPENDANT_WO_ORDER;
					


					workOrder.ACTUAL_START_DATE = null;
					workOrder.ACTUAL_END_DATE = null;
					workOrder.COMPLETION_DATE = null;


					var duration  = templateDetail[i].DURATION;
					if (duration == "")
						duration = 0;

					var duration  = parseInt(duration);

					promisedDate = addDays(promisedDate,  duration);
					//console.log("promisedDate:", promisedDate);
					workOrder.PROMISED_DATE  = promisedDate;
					workOrder.ORDERED_DATE  = new Date();
					

					if (workOrder.DEPT == ""){
					  workOrder.DEPT = template[0].DEPT;
					}
					if (workOrder.DIV == ""){
					  workOrder.DIV = template[0].DIV;
					}

					workOrder["_QUERY"] = "INSERT_DSP_WORK_ORDERS" ;
					Body.push(workOrder);
					//console.log(workOrder);
				}

				return Body;

		}

		function createOrder(db, req, res, receivedData, queryData)
		{
			options = setOptions(options, req);
			var Body =[];
			var ORDER_NO = receivedData.data[3].data[0].VAL;

			Body = setAddOrder_OrderDetails(Body, receivedData, queryData)
			callback = function(response) {
			  var str = '';

			  //another chunk of data has been received, so append it to `str`
			  response.on('data', function (chunk) {
				str += chunk;
			  });

			  response.on('end', function () {
				console.log("received:" +  str);
				var response = JSON.parse(str);
				var response1 = {};
				response1["message"] = response.message;
				response1["ORDER_NO"] = ORDER_NO;

				res.json(response1);


			  });
			response.on('error', function(err) {
				var ErrorMsg = "Error sending to Host :" +sendTo ;
				//console.log( ErrorMsg + " Error:" + err );
			  logging.log (logging.getThisLine(),'error', "ErrorMsg:" + ErrorMsg);
			  res.status(400).json({"error":ErrorMsg});

			});

			}
			//console.log("options:",options, " Body:", Body);
		
			var reqNew = http.request(options, callback);
			reqNew.write(JSON.stringify(Body));
			reqNew.end();

			//addOrder(res, db);
		}

		function performProcessCommand(db, queryData, req, res)
		{
			var statement ;
			console.log("queryData:",queryData);
			var Query = sqlparse.getParamData(statement, queryData,'_QUERY');
			var TEMPLATE_NAME = sqlparse.getParamData(statement, queryData,'TEMPLATE_NAME');
			TEMPLATE_NAME = TEMPLATE_NAME.split("'").join("");
			/*
			var ORDERED_DATE = sqlparse.getParamData(statement, queryData,'ORDERED_DATE');
			var PROMISED_DATE = sqlparse.getParamData(statement, queryData,'PROMISED_DATE');
			var SUBNO = sqlparse.getParamData(statement, queryData,'SUBNO');
			var ASSIGNEE = sqlparse.getParamData(statement, queryData,'ASSIGNEE');
			*/



			//console.log("Query:",Query);
			//console.log("TEMPLATE_NAME:",TEMPLATE_NAME);



			options = setOptions(options, req);

			var Body =[];
			Body = setGetTemplateOrderNo(Body, TEMPLATE_NAME);

			callback = function(response) {
			  var str = '';

			  //another chunk of data has been received, so append it to `str`
			  response.on('data', function (chunk) {
				str += chunk;
			  });

			  //the whole response has been received, so we just print it out here
			  response.on('end', function () {
				//console.log("received:" +  str);
				var receivedData = JSON.parse(str);
				createOrder(db, req, res, receivedData, queryData);

			  });
			response.on('error', function(err) {
				var ErrorMsg = "Error sending to Host :" +sendTo ;
				//console.log( ErrorMsg + " Error:" + err );
			  logging.log (logging.getThisLine(),'error', "ErrorMsg:" + ErrorMsg);
			  res.status(400).json({"error":ErrorMsg});

			});

			}
			//console.log("options:",options, " Body:", Body);
		
			var reqNew = http.request(options, callback);
			reqNew.write(JSON.stringify(Body));
			reqNew.end();
		}




		performProcessCommand(db, queryData, req, res);


		


    },
    processSaveAtt: function(db, queryData, req, res)
    {
		var attachments = [];
		var userName = valifyConfig.userName;
		function updateExternalInfo(db, req, res,  queryData, attachments, externalInfo, external_id)
		{
			options = setOptions(options, req);
			var Body = [];
			var newVal ={};
			newVal.ATTACHMENTS = attachments;
			newVal.EXTERNAL_INFO = externalInfo;
			newVal.ORDER_NO = external_id;
			newVal["_QUERY"] = "UPDATE_DSP_ORDERS_EXTERNAL_INFO" ;
			Body.push(newVal);

			callback = function(response) {
			  var str = '';

			  //another chunk of data has been received, so append it to `str`
			  response.on('data', function (chunk) {
				str += chunk;
			  });

			  response.on('end', function () {
				//console.log("received:" +  str);
				var response = JSON.parse(str);
				var response1 = {};
				response1["message"] = response.message;
				response1["ORDER_NO"] = external_id;

				res.json(response1);


			  });
			response.on('error', function(err) {
				var ErrorMsg = "Error sending to Host :" +sendTo ;
				//console.log( ErrorMsg + " Error:" + err );
			  logging.log (logging.getThisLine(),'error', "ErrorMsg:" + ErrorMsg);
			  res.status(400).json({"error":ErrorMsg});

			});

			}
			//console.log("options:",options, " Body:", Body);
		
			var reqNew = http.request(options, callback);
			reqNew.write(JSON.stringify(Body));
			reqNew.end();

			//addOrder(res, db);
		}


		function saveImage(image,fileName )
		{
			var bPart = image.slice(0,2);
			//console.log("bPart:",bPart);
			if (bPart == "b'")
				image = image.slice(2);

			let buff = new Buffer.from(image, 'base64');

			var newPath = attDir + "/" + userName + "/" + fileName ;
			console.log ("newPath:" + newPath);
			
			fs.writeFile(newPath, buff,   {encoding: 'base64'},function(err) {
				if(err) {
					console.log(err);
				} else {
					console.log("The file was saved!");
				}
			});
			var fileRec = {
				"name" : fileName,
				"id" : fileName,
				"size" : buff.length
			};

			return fileRec;
		}	
		function saveImageAttachments( Name, property )
		{
			
			var fileName = req.body.data.external_id + "_" + Name + ".jpg";
			if (typeof req.body.data[property] != "undefined"){
				var fileRec = saveImage(req.body.data[property],fileName );
				attachments.push(fileRec);
			
				delete req.body.data[property]; 
			}
		}
			//console.log("attDir:", attDir);
			var userNameDir = attDir + "/" + userName;
			if (!fs.existsSync(userNameDir)){
				fs.mkdirSync(userNameDir);
			}
			var userNameTempDir = "";
			if (!fs.existsSync(attDir)){
				fs.mkdirSync(attDir);
			}
			var userNameDir = attDir + "/" + userName;
			if (!fs.existsSync(userNameDir)){
				fs.mkdirSync(userNameDir);
			}

			saveImageAttachments ( "front_image" , valifyConfig.front_image);
			saveImageAttachments ( "back_image" , valifyConfig.back_image);
			saveImageAttachments ( "face_img" , valifyConfig.face_img);

			/*
			var fileName = req.body.data.external_id + "_front_image" + ".jpg";
			var fileRec = saveImage(req.body.data.egy_nid_ocr__front_image,fileName );
			attachments.push(fileRec);
			delete req.body.data.egy_nid_ocr__front_image; 
			*/

			//console.log("req.body.data:",req.body.data);
			//console.log("attachments:",attachments);

			attachments = JSON.stringify(attachments);
			var externalInfo = JSON.stringify(req.body.data);
			var password =  valifyConfig.password;
			var StrAuth = userName + ":" + password;
			//let buff = new Buffer(StrAuth);
			let buff = new  Buffer.alloc(StrAuth.length, StrAuth);
			let base64data = buff.toString('base64');
			//console.log ("base64data:", base64data);
			req.headers.authorization = "Basic " + base64data;

			//console.log ("req.headers.authorization:", req.headers.authorization);
			updateExternalInfo(db, req, res,  queryData, attachments, externalInfo, req.body.data.external_id )

			
			/*
			res.json(
			{
				"message": "success"
			})
			*/
				

			

	}



};


