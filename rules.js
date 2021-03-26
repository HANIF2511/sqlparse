
// rules.js
// ========
var logging = require("./logging.js")
/*
var translog = require("./translog.js")
var users = require("./users.js")
var xsltmap = require("./xsltmap.js")
var http = require('http');
var request = require('sync-request');
*/
var rulehttp = require("./rulehttp.js")
var rulemail = require("./rulemail.js")
var rulesms = require("./rulesms.js")

var rulesPostDef = {
	rulePtrsArr:[],
	rulesArr : [],
	actionsArr : []
};
var rulesPreDef = {
	rulePtrsArr:[],
	rulesArr : [],
	actionsArr : []
};

//var rulesDef ;

/*
var rulePtrsArr = [];
//var rulePtrsArr = [];

var rulesArr = [];
var actionsArr = [];
*/
var hostsArr = [];
var hostsMapArr = [];

	var optionsGlob;
	var bodyToSendGlob;
	var ruleLogGlob;

module.exports = {


	checkRules: function (db, req, res, queryData,Trigger)
    {

		//console.log("rulesPostDef:",rulesPostDef);
		if (Trigger == "POST")
			rulesDef = rulesPostDef;
		else if (Trigger == "PRE")
			rulesDef = rulesPreDef;
		//console.log("*****************rulesDef:",rulesDef);
		var status = checkRulesByTrigger (db, req, res, queryData,rulesDef, Trigger);
		return status;

		function performAction(db, req, qry, ptr, queryData, rule, rulesDef, Trigger)
		{
			console.log("---performAction:");
				var status = 0;
				var statusRec ={
					status : 0,
					msg : ""
				  };
				var actionPtr = rulesDef.actionPtrsArr[qry];
				if (typeof actionPtr !== "undefined")
				{

					console.log("ptr:", ptr);
					console.log("actionPtr:", actionPtr);
					var i=ptr;

					var ptr1 = actionPtr[i];

					if (typeof actionPtr[i+1] !== "undefined")
						var ptr2 = actionPtr[i+1];
					else
						var ptr2 = rulesDef.actionsArr.length

					console.log("ptr1:",ptr1, " ptr2:", ptr2);
					var j = ptr1;
					var ruleID = rulesDef.actionsArr[j].RULE_ID;
					while ( ( j < ptr2) && (status == 0) )
					{
						if (ruleID != rulesDef.actionsArr[j].RULE_ID)
						{
							break;
						}
						console.log("rulesDef.actionsArr:",rulesDef.actionsArr[j]);
						if (  ( rulesDef.actionsArr[j].ACTION_CODE == "SEND" ) 
							||( rulesDef.actionsArr[j].ACTION_CODE == "SEND_WAIT" ))
						{
							statusRec = rulehttp.sendToServer(db, req, rulesDef.actionsArr[j], queryData, rule,rulesDef.actionsArr[j], Trigger, hostsArr, hostsMapArr);
							status = statusRec.status;
						}
						else if ( rulesDef.actionsArr[j].ACTION_CODE == "EMAIL" )
						{
							statusRec = rulemail.sendByMail(db, req, rulesDef.actionsArr[j], queryData, rule,rulesDef.actionsArr[j], Trigger, hostsArr, hostsMapArr);
							status = statusRec.status;
						}
						else if ( rulesDef.actionsArr[j].ACTION_CODE == "SMS" )
						{
							statusRec = rulesms.sendBySMS(db, req, rulesDef.actionsArr[j], queryData, rule,rulesDef.actionsArr[j], Trigger, hostsArr, hostsMapArr);
							status = statusRec.status;
						}

						j++;
					}
				}
				return statusRec;

		}
/////////////////////////////////////////////////////////
		function checkRulesByTrigger (db, req, res, queryData,rulesDef, Trigger)
		{
			var statusRec;
					function checkRule(rule, queryData)
					{
						var ruleMatch = false;
						//console.log("------rule:",rule, " queryData:", queryData);
						var fieldData = queryData[rule.FIELD] ;
						
						switch(rule.OPERATION) {
						  case "=":
							  if (fieldData == rule.FIELD_VALUE)
							  {
								ruleMatch = true;
							  }
							break;
						  case "<":
							  if (fieldData < rule.FIELD_VALUE)
							  {
								ruleMatch = true;
							  }
							break;
						  case "<=":
							  if (fieldData <= rule.FIELD_VALUE)
							  {
								ruleMatch = true;
							  }
							break;
						  case ">":
							  if (fieldData > rule.FIELD_VALUE)
							  {
								ruleMatch = true;
							  }
							break;
						  case ">=":
							  if (fieldData >= rule.FIELD_VALUE)
							  {
								ruleMatch = true;
							  }
							break;
						  case "<>":
							  if (fieldData != rule.FIELD_VALUE)
							  {
								ruleMatch = true;
							  }
							break;
						  case "INSTR":
							  console.log("==== searching fieldData :" , fieldData , " inside rule.FIELD_VALUE:" , rule.FIELD_VALUE);
							  if (rule.FIELD_VALUE.search(fieldData) != -1 )
							  {
								  console.log("==== search results true");
								ruleMatch = true;
							  }
							break;
						  default:
							ruleMatch = false;
						}
						console.log("ruleMatch:", ruleMatch, " fieldData:", fieldData, " OPERATION:", rule.OPERATION,  " FIELD_VALUE:", rule.FIELD_VALUE);
						return ruleMatch;

					}		

			var status = 0;
			statusRec ={
				status : 0,
				msg : ""
			};

			//console.log("checkRulesByTrigger:queryData:", queryData);

			var qry = queryData._QUERY;
			//console.log("-------- _QUERY:", queryData._QUERY, " rulesDef.rulePtrsArr:", rulesDef.rulePtrsArr);
			//console.log("rulesDef.rulePtrsArr:",rulesDef.rulePtrsArr);
			var rulePtr = rulesDef.rulePtrsArr[qry];
			//console.log("rulePtr:",rulePtr);

			if (typeof rulePtr !== "undefined")
			{
				//var actionPtr = rulesDef.rulePtrsArr[qry];
				//if (typeof actionPtr !== "undefined")
				{
					var result = false;
					var i=0;
					
					while ( (i<rulePtr.length) && (status == 0) )
					{
						var ptr1 = rulePtr[i];
						if (typeof rulePtr[i+1] !== "undefined")
							var ptr2 = rulePtr[i+1];
						else
							var ptr2 = rulesDef.rulesArr.length

						//console.log("ptr1:",ptr1, " ptr2:", ptr2);
						var j = ptr1;
						while ( j < ptr2)
						{
							//console.log("--------------------rulesDef.rulesArr:", rulesDef.rulesArr[j].RULE_ID, " item:", rulesDef.rulesArr[j].ITEM);
							var ruleMatch = checkRule(rulesDef.rulesArr[j], queryData);
							if (ruleMatch == false)
								break;
							j++;
						}
						//console.log("--Conditions ruleMatch:", ruleMatch, " for rule:", rulesDef.rulesArr[ptr1].RULE_ID);
						if (ruleMatch == true)
						{
							statusRec = performAction(db,req, qry, i, queryData, rulesDef.rulesArr[ptr1],rulesDef, Trigger );
							status = statusRec.status

						}

						//if (ruleMatch == false)
						//	break;
						i++;
					}
				}


			}
			return statusRec;
		}

    },

    readRules: function(db)
    {
		/*
		 public rulesPostQueryDef = {
    rulePtrsArr:[],
    rulesArr : [],
    actionPtrsArr : [],
    actionsArr : []
  };*/
		rulesPostDef.rulePtrsArr = [];
		rulesPostDef.rulesArr = [];

		rulesPostDef.actionPtrsArr = [];
		rulesPostDef.actionsArr = [];

		rulesPreDef.rulePtrsArr = [];
		rulesPreDef.rulesArr = [];

		rulesPreDef.actionPtrsArr = [];
		rulesPreDef.actionsArr = [];

		hostsArr = [];
		hostsMapArr = [];


		readRulesByTrigger(db, "POST", rulesPostDef);
		readRulesByTrigger(db, "PRE", rulesPreDef);

		function storeActionsPtrs(actions, rulesDef)
		{
		  var currentQUERY_DEF = "";
		  var currentRULE_ID = "";
		  var actionPtrs =[];

		  for (var i=0; i<actions.length; i++)
		  {
			if ( ( currentQUERY_DEF != actions[i].QUERY_DEF ) && ( currentRULE_ID != actions[i].RULE_ID ) )
			{
			  if ( i == 0)
				  actionPtrs.push(i);
			  if (currentQUERY_DEF != "")
			  {
				rulesDef.actionPtrsArr[currentQUERY_DEF] = actionPtrs;
				actionPtrs = [];
				actionPtrs.push(i);
			  }
			  
			  currentQUERY_DEF = actions[i].QUERY_DEF ;
			  currentRULE_ID = actions[i].RULE_ID ;
			  ////console.log("rulePtrs1:",rulePtrs);

			}
			else if ( ( currentQUERY_DEF == actions[i].QUERY_DEF ) && ( currentRULE_ID != actions[i].RULE_ID ) )
			{
			  currentRULE_ID = actions[i].RULE_ID ;
			  actionPtrs.push(i);
			  
			}
			//console.log("actionPtrs2:",actionPtrs);
		  }
		  //actionPtrs.push(i);
		  rulesDef.actionPtrsArr[currentQUERY_DEF] = actionPtrs;
		  //console.log("rulesDef.actionPtrsArr:",rulesDef.actionPtrsArr);
		}



			function storeRulesPtrs(rules, rulesDef)
			{
			  var currentQUERY_DEF = "";
			  var currentRULE_ID = "";
			  var rulePtrs =[];

			  for (var i=0; i<rules.length; i++)
			  {
				//console.log(rules[i].QUERY_DEF + " : " + rules[i].RULE_ID + "          " + currentQUERY_DEF + " : " + currentRULE_ID);
				if ( ( currentQUERY_DEF != rules[i].QUERY_DEF ) && ( currentRULE_ID != rules[i].RULE_ID ) )
				{
				  //console.log(" not equal");
				  if ( i == 0)
					  rulePtrs.push(i);
				  if (currentQUERY_DEF != "")
				  {
					//console.log("--storing rulePtrs1:",rulePtrs);
					rulesDef.rulePtrsArr[currentQUERY_DEF] = rulePtrs;
					rulePtrs = [];
					rulePtrs.push(i);
				  }
				  
				  currentQUERY_DEF = rules[i].QUERY_DEF ;
				  currentRULE_ID = rules[i].RULE_ID ;
				  //console.log("rulePtrs2:",rulePtrs);

				}
				else if ( ( currentQUERY_DEF == rules[i].QUERY_DEF ) && ( currentRULE_ID != rules[i].RULE_ID ) )
				{
				  //console.log(" not equal2");
				  rulePtrs.push(i);
				  currentRULE_ID = rules[i].RULE_ID ;
				  //console.log("rulePtrs3:",rulePtrs);
				}
				//console.log("rulePtrs4:",rulePtrs);
			  }
			  //rulePtrs.push(i);
			  //console.log("rulePtrs5:",rulePtrs);
			  rulesDef.rulePtrsArr[currentQUERY_DEF] = rulePtrs;
			  //console.log("test3:rulesDef.rulePtrsArr:",rulesDef.rulePtrsArr);
			}
		function readRulesByTrigger(db, Trigger, rulesDef) {

			var ErrorMsg = "";
			var sql = "select A.MODULE, A.RULE_ID, A.QUERY_DEF , A.RULE_KEY, A.RESPONSE_DATA_ID, A.RESPONSE_DATA_NAME, B.ITEM, B.FIELD, B.OPERATION, B.FIELD_VALUE " +
				"	from ADM_RULE_DEF A, ADM_RULE_ITEM B" +
				"	where A.MODULE = B.MODULE " +
				"	  AND A.RULE_ID = B.RULE_ID " +
				"	 AND ( A.DISABLED = '0' or A.DISABLED is  null)  " +
				"	 AND ( B.DISABLED = '0' or B.DISABLED is  null)  " +
				"	 AND A.RULE_TRIGGER = '" + Trigger + "' " +
				"	order by A.MODULE, A.RULE_ID, B.ITEM";
			//console.log("sql:", sql);
			var params = [];
			db.query(sql, function(err, result) {
				if (err) {
					logging.log(logging.getThisLine(), 'error', 'err:' + err);

					ErrorMsg = err;
					logging.log(logging.getThisLine(), 'error', ErrorMsg);
					process.exit();

				}
				storeRulesPtrs(result.rows, rulesDef);
				rulesDef.rulesArr = result.rows;
				//console.log("1------rulesDef:",rulesDef);
				////////////////////////////

				var ErrorMsg = "";
				var sql = "select A.MODULE, A.RULE_ID, A.QUERY_DEF , B.ACTION_ID, B.ACTION_CODE, B.SEND_TO,B.MAP_ID, B.BODY_DATA, B.PARAMETER_DATA, B.EXTRA_DATA " +
					" from ADM_RULE_DEF A, ADM_RULE_ACTION B " +
					" where A.MODULE = B.MODULE " +
					"  AND A.RULE_ID = B.RULE_ID " +
					"	 AND ( A.DISABLED = '0' or A.DISABLED is  null)  " +
					"	 AND ( B.DISABLED = '0' or B.DISABLED is  null)  " +
					"	 AND A.RULE_TRIGGER = '" + Trigger + "' " +
					" order by A.MODULE, A.RULE_ID, B.ACTION_ORDER";
				////console.log("sql:", sql);
				db.query(sql, function(err, result) {
					if (err) {
						logging.log(logging.getThisLine(), 'error', 'err:' + err);

						ErrorMsg = err;
						logging.log(logging.getThisLine(), 'error', ErrorMsg);
						process.exit();

					}
					////console.log("result.rows",result.rows);
					storeActionsPtrs(result.rows, rulesDef);
					rulesDef.actionsArr = result.rows;
					////console.log("2-----rulesDef:",rulesDef);
					if (Trigger == "POST")
						rulesPostDef = rulesDef;
					else if (Trigger == "PRE")
						rulesPreDef = rulesDef;
					////console.log("rulesPreDef:",rulesPreDef);


					var ErrorMsg = "";
					var sql = "select HOST_ID, HOST, URL, PROTOCOL,  PATH, PORT, HTTP_METHOD, RULE_AUTHORIZATION , RULE_HEADER,  CONTENT_TYPE, SUCCESS_MSG " +
						" from ADM_RULE_HOST ";
					////console.log("sql:", sql);
					db.query(sql, function(err, result) {
						if (err) {
							logging.log(logging.getThisLine(), 'error', 'err:' + err);

							ErrorMsg = err;
							logging.log(logging.getThisLine(), 'error', ErrorMsg);
							process.exit();

						}
						////console.log("result.rows",result.rows);
						hostsArr = result.rows;
						////console.log("3------rulesDef:",rulesDef);
						//return rulesDef;

						var ErrorMsg = "";
						var sql = "select HOST_ID, MAP_ID, XSLT_SEND, XSLT_RECEIVE " +
							" from ADM_RULE_HOST_MAP ";
						////console.log("sql:", sql);
						db.query(sql, function(err, result) {
							if (err) {
								logging.log(logging.getThisLine(), 'error', 'err:' + err);

								ErrorMsg = err;
								logging.log(logging.getThisLine(), 'error', ErrorMsg);
								process.exit();

							}
							////console.log("result.rows",result.rows);
							hostsMapArr = result.rows;
							////console.log("3------rulesDef:",rulesDef);
							//return rulesDef;
							

						});
						

					});



				});


				////////////////////////////
				//usersPassword = result.rows;

			});
			
		}
},
    checkToReloadRules: function(db, queryData)
    {
		////console.log("checkToReloadRules:");
		var rulesQueries = {
			
			   "INSERT_ADM_RULE_DEF":1,
			   "UPDATE_ADM_RULE_DEF":1,
			   "DELETE_ADM_RULE_DEF":1,

			   "INSERT_ADM_RULE_ITEM":1,
			   "UPDATE_ADM_RULE_ITEM":1,
			   "DELETE_ADM_RULE_ITEM":1,

			   "INSERT_ADM_RULE_ACTION":1,
			   "UPDATE_ADM_RULE_ACTION":1,
			   "DELETE_ADM_RULE_ACTION":1,

			   "INSERT_ADM_RULE_HOST":1,
			   "UPDATE_ADM_RULE_HOST":1,
			   "DELETE_ADM_RULE_HOST":1,

			   "INSERT_ADM_RULE_HOST_MAP":1,
			   "UPDATE_ADM_RULE_HOST_MAP":1,
			   "DELETE_ADM_RULE_HOST_MAP":1

			   };

		var i=1;
		while(i<queryData.length ){
			var qry = queryData[i]._QUERY;
			////console.log("qry:",qry,   " rulesQueries[qry]:", rulesQueries[qry]);
			if (rulesQueries[qry] == 1)
			{
				this.readRules(db);
				break;
			}

			i++;
		}
	}
,
    getHostsInfo: function()
    {
		var hostsInfo =
		{
			"hostsArr" : hostsArr,
			"hostsMapArr" : hostsMapArr
		}
		return hostsInfo;
	}


};
