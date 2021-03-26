
var nodemailer = require('nodemailer');
const config = require('config');
const mailConfig = config.get('Customer.mailConfig');
var rulefunc = require("./rulefunc.js")

var transporter = nodemailer.createTransport({
//  service: 'mail.gordano.com',
  host: mailConfig.host,		//'mail.gordano.com',
   port: mailConfig.port,		//465,
  auth: {
    user: mailConfig.user,		//'fuadk@gordano.com',
    pass: mailConfig.pass		//'egypt123'
  }
});

module.exports = {
	sendByMail : function(db, req, actionsArr, queryData, rule, action, Trigger,  hostsArr, hostsMapArr)
	{

		function performsendMail(to, subject, html)
		{
			console.log("to:",to," subject:", subject, " html:", html);
			html = rulefunc.encodeURL(html);
			console.log("html:", html);
			console.log("mailConfig:",mailConfig);

			var mailOptions = {
			  from: mailConfig.from	,	//'noreply@zain.com',
			  to: to,
			  subject: subject,
			  html: html
			};
			var error =0;
			var msg ="";

			var statusRec ={
				  status : error,
				  msg : msg
				};


			transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
				console.log("there is an error:", error);
				statusRec.status = 1;
				statusRec.msg = error.toString();
				rulefunc.LogRule(ruleLog, statusRec.msg , statusRec.status );
				return statusRec;
			  } else {
				console.log('Email sent: ' + info.response);
				statusRec.status = 0;
				console.log('statusRec1: ' , statusRec);
				statusRec.msg = info.response;
				console.log('statusRec2: ' , statusRec);
				rulefunc.LogRule(ruleLog, statusRec.msg , statusRec.status );
				return statusRec;
			  }
			});
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
		var subject = "";
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
				paramData = rulefunc.formatIfDate(paramData);


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

				//paramData = rulefunc.getElmValue (paramData, queryData);
				//console.log("-----------------------------param:", param, " paramData:", paramData);
				var subjectData = paramData;

				if (param.toUpperCase() == "SUBJECT")
				{
					var array = subjectData.split(":");
					console.log("array:", array, " array.length:", array.length);
					var j = 1;

					for (var i = j; i < array.length; i = i + 2)
					{
						var paramData = ":" + array[i];
						paramData = rulefunc.getElmValue (paramData, queryData);

						console.log("-----------------------------array[i]:" + array[i] + ":paramData:"+ paramData);
						array[i] = paramData;
					}
					subjectData = array.join("");

					subject = subjectData;
				}
				else if (param.toUpperCase() == "TO")
				{
					paramData = rulefunc.getElmValue (paramData, queryData);
					console.log("-----------------------------param:", param, " paramData:", paramData);
					to = paramData;
				}

			}
		}

		console.log("to:", to, " subject:", subject, " bodyData:", bodyData);
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
		
		var statusRec = performsendMail(to, subject, bodyData);
		console.log("statusRec3:", statusRec);
			
		return statusRec;
		
	}
};