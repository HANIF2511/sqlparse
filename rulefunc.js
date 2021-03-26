var users = require("./users.js")
var logging = require("./logging.js")
var decode = require('decode-html');

module.exports = {
	LogRule: function(ruleLog, msgResponse, status)
	{
		function prepareDataForDB(dataIn)
		{
			var dataOut = JSON.stringify(dataIn);
			//console.log("dataIn:", dataIn, " dataOut:", dataOut);
			dataOut = dataOut.split("'").join('"');
			return dataOut;

		}

		console.log("-----msgResponse:", msgResponse, " status:", status,  " ruleLog:", ruleLog);
		var db = ruleLog.db;
		var d = new Date();
		var dateIso = d.toISOString();

		var RULE_KEY = ruleLog.rule.RULE_KEY;

		var array = RULE_KEY.split(",");
		//ruleKey ={};
		ruleKey ="";
		ruleKeyName ="";
		for (var i = 0; i < array.length; i++)
		{
			var elem = array[i];
			var elem_value = ruleLog.queryData[elem];
			if (typeof elem_value !== "undefined")
			{
				//ruleKey[elem] = elem_value;
				if (ruleKey != "")
				{
					ruleKey = ruleKey + "_";
				}
				ruleKey = ruleKey + elem_value;

				if (ruleKeyName != "")
				{
					ruleKeyName = ruleKeyName + "_";
				}
				ruleKeyName = ruleKeyName + elem;
			}

		}
		console.log("ruleKey:", ruleKey, " ruleKeyName:", ruleKeyName);


		
		console.log("RULE_KEY:", RULE_KEY);
		


		var queryData = prepareDataForDB(ruleLog.queryData);
		var bodyToSend = prepareDataForDB(ruleLog.bodyToSend);
		var parametersToSend = prepareDataForDB(ruleLog.parametersToSend);
		//var ruleKey = prepareDataForDB(ruleKey);

		console.log ("queryData:" + queryData);

//			var logDataStr = JSON.stringify(logData);
//			logDataStr = logDataStr.split("'").join('"');


		//console.log ("logDataStr:" + logDataStr);
		
		var statement = "insert into  ADM_RULE_LOG ";
		statement = statement + " ( RULE_KEY ,RULE_KEY_NAME ,STATUS, MODULE ,RULE_ID ,ACTION_ID ,SENT_DATE ,MSG_RECEIVED ,PARAMETER_SENT, BODY_SENT , MSG_RESPONSE ,LOGDATE ,LOGNAME )";
		statement = statement + " values ( ?, ?, ? , ?, ? , ? , ? , ? , ?, ? , ? , ?, ? )";
		var d = new Date();
		var dateIso = d.toISOString();

console.log("statement:",statement);
console.log("dateIso:",dateIso, " users.getUserName():" , users.getUserName() );
		logging.log (logging.getThisLine(),'info', 'statement:' + statement);
		db.query(statement, [ruleKey , ruleKeyName, status,  ruleLog.rule.MODULE, ruleLog.rule.RULE_ID, ruleLog.action.ACTION_ID, ruleLog.sentDate, 
							 queryData , parametersToSend, bodyToSend, msgResponse,  dateIso  ,  users.getUserName() ]).on('data', function (err, row) {
							console.log("err:",row);
							console.log("row:",row);
							})
		
		/*db.query(stmt, function  (err, result) 
		{
			if (err)
			{
				console.log( "err saving log:" , err);
			}
			else
			{
				//console.log("added");

			}
		});*/


	},

	getElmValue : function(paramData, queryData)
	{

		function getORDER_FIELDSData(param,orderFields)
		{
			var val = "";
			if (orderFields != "")
			{
				var array = param.split(".");
				var fieldName = array[1];
				console.log("fieldName:",fieldName);
				orderFields = JSON.parse(orderFields);
				console.log("orderFields:",orderFields);
				var fieldsData = orderFields.data;
				val = fieldsData[fieldName];
			}
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
	},
	encodeURL: function(text)
	{
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
				url = decode (url);
				var part3 = part2.slice(ptr2);
				console.log ("-------------------url:",url, " part3:", part3);

				var array = url.split("?");
				console.log("array:", array);

				var buff = Buffer.alloc(array[1].length, array[1]);
				//let buff = new Buffer(array[1]);
				let base64data = buff.toString('base64');

				array[1] = base64data;

				console.log("array:", array);
				url = array.join("?");
				console.log("url:",url);

				text = part1 + url + part3;

				console.log("text:",text);
			}

		}
		return text;
	},
	isDate: function(value){
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
    },

	formatIfDate: function(value)
	{
		var newVal = value;
			
		if (this.isDate (value))
		{
			value = new Date(value);
			value = value.toISOString();
			var array = value.split(".")
			var array1 = array[0].split("T")
			newVal = array1.join(" ")
		}
		return newVal;
	}


};