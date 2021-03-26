// apistrans.js
// ========
var logging = require("./logging.js")
var rulehttp = require("./rulehttp.js")
module.exports = {
	apiSend: function(db,queryData, req, res, hostsInfo)
    {
		//console.log("queryData:",queryData);
		var actionsArr = {
			"BODY_DATA" : queryData.BODY_DATA,
			"PARAMETER_DATA" : queryData.PARAMETER_DATA,
			"SEND_TO" : queryData.HOST_ID,
			"MAP_ID" : queryData.MAP_ID
		};
		var rule = null;
		var action = actionsArr;
		var Trigger = null;
		rulehttp.sendToServer (db, req, actionsArr, queryData.Data, rule,action, Trigger,  hostsInfo.hostsArr, hostsInfo.hostsMapArr);
        var response = [
                        {
                        "userId": 1,
                        "id": 1,
                        "title": "Fuad",
                        "completed": false
                        }];
        res.json(response);
    }

};


