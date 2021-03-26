
var request = require('sync-request');
const config = require('config');
const smsConfig = config.get('Customer.smsConfig');
var rulefunc = require("./rulefunc.js")
const Vonage = require('@vonage/server-sdk')


const vonage = new Vonage({
  apiKey: '8dc2e8c8',
  apiSecret: 'FdAa8jfNOi2aIAyH',
})



module.exports = {
	sendBySMS : function(db, req, actionsArr, queryData, rule, action, Trigger,  hostsArr, hostsMapArr)
	{

			function performsendSMS(to,  text)
			{
			const from = 'Zain Bahrain'

			vonage.message.sendSms(from, to, text, (err, responseData) => {
				if (err) {
					console.log(err);
				} else {
					if(responseData.messages[0]['status'] === "0") {
						console.log("Message sent successfully.");
						statusRec.status = responseData.messages[0]['status'];
						statusRec.msg = "Message sent successfully.";
						rulefunc.LogRule(ruleLog, statusRec.msg , statusRec.status );

					} else {
						console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
						statusRec.status = responseData.messages[0]['status'];
						statusRec.msg = `Message failed with error: ${responseData.messages[0]['error-text']}`;
						rulefunc.LogRule(ruleLog, statusRec.msg , statusRec.status );
					}
				}
			})

			return statusRec;
		}

		console.log("****************actionsArr1:", actionsArr, " queryData:", queryData);
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
		var to = "";
		var bodyData = "";
		if ( (actionsArr.BODY_DATA != null) && (actionsArr.BODY_DATA != "") )
		{
			bodyData = actionsArr.BODY_DATA;
			console.log("bodyData:", bodyData);
			var array = bodyData.split("::");
			console.log("array:", array, " array.length:", array.length);
			var j = 1;

			for (var i = j; i < array.length; i = i + 2)
			{
				var paramData = ":" + array[i];
				paramData = rulefunc.getElmValue (paramData, queryData);

				console.log("-----------------------------array[i]:" + array[i] + ":paramData:"+ paramData);
				array[i] = paramData;
			}
			bodyData = array.join("");
			console.log("bodyData:", bodyData);

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
				if (param.toUpperCase() == "TO")
					to = paramData;

			}
		}

		console.log("to:", to, " bodyData:", bodyData);
		var d = new Date();
		var dateIso = d.toISOString();

		var ruleLog = {
			rule : rule,
			action : action,
			queryData : queryData,
			bodyToSend : bodyData,
			parametersToSend : parameterData, 
			"db": db,
			sentDate : dateIso,
			hostDef : ""
		};

		var statusRec = performsendSMS(to,  bodyData);
		console.log("statusRec3:", statusRec);
			
		return statusRec;
		
	}
};