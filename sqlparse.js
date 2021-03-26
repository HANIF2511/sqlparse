
// sqlparse.js
// ========
var statements;
//statements = require("./statements.json")
var fs = require('fs');
var logging = require("./logging.js")
var users = require("./users.js")

function readStatements()
{
	var filename = "./statements.json";
	logging.log (logging.getThisLine(),'info', "reading file :" + filename);
	statements = JSON.parse(fs.readFileSync(filename));
//	logging.log (logging.getThisLine(),'info', "statements :" + JSON.stringify(statements));

}
var paramConfig = {
	"trans" : "N",
	"limit" : -1,
	"page_size" : 10,
	"page" : 0
};
module.exports = {
    getParamConfig: function()
    {
		return paramConfig;
	}
	,
	parseUrl: function(queryString)
    {
		
		var array = queryString.split("&");
        var param, format, query;
        var queryData = [];
        var paramData = {};

		paramConfig.trans = "N";
		paramConfig.limit = -1;
		paramConfig.page = "";
		paramConfig.page_size = "";

		function SaveParam(param)
		{
			paramData[param[0]] = param[1];
		}

		logging.log (logging.getThisLine(),'info', "array:" + JSON.stringify(array));

        for (var i = 0; i < array.length; i++)
        {
            param = array[i].split("=");
			logging.log (logging.getThisLine(),'info', "param:" + JSON.stringify(param));
			param[0] = param[0].toUpperCase();
            param[1] = decodeURI(param[1]);
			logging.log (logging.getThisLine(),'info', "----param:" + JSON.stringify(param));
			param[1] = decodeURIComponent(param[1]);
			logging.log (logging.getThisLine(),'info', "----param:" + JSON.stringify(param));


			if (param[0] == "_FORMAT")
            {
                format = param[1];
                //queryData.push(param);
				SaveParam(param);
            }
            else if (param[0] == "_TRANS")
            {
				paramConfig.trans = param[1];
            }
            else if (param[0] == "_LIMIT")
            {
				paramConfig.limit = param[1];
            }
            else if (param[0] == "_PAGE_SIZE")
            {
				paramConfig.page_size = param[1];
            }
            else if (param[0] == "_PAGE")
            {
				paramConfig.page = param[1];
            }
			else if (param[0] == "_QUERY")
            {
				if ( Object.keys(paramData).length != 0)
                {
                    queryData.push(paramData);

                    paramData = {};
                    //paramData.push(param);
					SaveParam(param);

                }
                else
                {
                    //paramData.push(param);
					SaveParam(param);
                }
            }
			else if (param[0].toLowerCase == "_STMT")
            {
					var paramStmt = "";
			        for (var j = 1; j < param.length; j++)
			        {
						paramStmt = paramStmt  + param[j] ;
					}
					 paramStmt = decodeURIComponent(paramStmt);
					 var Newparam=[];
					 Newparam[0] = param[0];
					 Newparam[1] =paramStmt;			
					 param = Newparam;

            }

			else
            {
	            if (param[0].toLowerCase() == "_WHERE") //Fuad: check if this code needed
	            {
					var paramDataWhere = "";
			        for (var j = 1; j < param.length; j++)
			        {
						if (paramDataWhere != "")
							paramDataWhere = paramDataWhere + "=" 
						paramDataWhere = paramDataWhere  + param[j] ;
					}
					 paramDataWhere = decodeURIComponent(paramDataWhere);
					 var Newparam=[];
					 Newparam[0] = param[0];
					 Newparam[1] =paramDataWhere;			
					 param = Newparam;

				}

				logging.log (logging.getThisLine(),'info', "pushing:" + JSON.stringify(param));
                //paramData.push(param);
				SaveParam(param);

            }

        }
		if ( Object.keys(paramData).length != 0)
        {
			queryData.push(paramData);
        }


//	  logging.log (logging.getThisLine(),'info', "queryData:");
	  logging.log (logging.getThisLine(),'info', "queryData:" + JSON.stringify(queryData));

      return queryData;

    },
	getParamData:function (statement,queryData,param)
	{
		var i = 1;
		var paramData = "";
		logging.log (logging.getThisLine(),'info', 'param:' + param + ' queryData: HF Please' + JSON.stringify(queryData));
		logging.log (logging.getThisLine(),'info', 'statement:' + statement);
		var paramData = queryData[param.toUpperCase()];
		if (  param.toUpperCase() ==  "_STMT")
		{
			if ( (typeof paramData !== "undefined") && ( paramData !== "''") )
			{
				logging.log (logging.getThisLine(),'info', 'it is a valide _STMT:' + paramData);
			}
			else
				paramData =  "";
		}
		else
		{
			if  (typeof paramData == "string")
			{
				var n = paramData.search("'");
				//console.log("============paramData:", paramData , " n:", n);
				if (n == -1)
				{
					paramData = "'" + paramData + "'";
				}
				else
				{
					if ( ( param !== "_WHERE") && ( ( param === "WHERE_CLAUSE") || ( param === "WHERE_MAND_CLAUSE") ) )
						paramData = '"' + paramData + '"';
				}

			}
			else
			if (typeof paramData === "undefined")
				paramData = "''";


			logging.log (logging.getThisLine(),'info', " :param:" + param + " :paramData:" + paramData);

			if (  param.toUpperCase() ==  "_WHERE")
			{
				if ( (typeof paramData !== "undefined") && ( paramData !== "''") )
				{
					logging.log (logging.getThisLine(),'info', 'it is a valide _WHERE:' + paramData);
					var n = statement.toUpperCase().search(" WHERE ");
					logging.log (logging.getThisLine(),'info', ' n:' + n);
					if (n != -1)
						paramData = " and " + paramData;
					else
						paramData = " where " + paramData;
				}
				else
					paramData =  "";
			}
		}
		if ( (param == "LOGDATE") || (param == "LOGNAME") )
		{
			if ( paramData == "''")
			{
				var n = statement.toUpperCase().trim().startsWith("INSERT");
				logging.log (logging.getThisLine(),'info', 'n:' + n + ' statement:' + statement);
				if (  n == false)
					var n = statement.toUpperCase().trim().startsWith("UPDATE");
				logging.log (logging.getThisLine(),'info', 'n:' + n + ' statement:' + statement);
				if (n != false)
				{
					if (param == "LOGDATE") 
					{
						var d = new Date();
						var dateIso = d.toISOString();
						paramData = "'" + dateIso + "'" ;
					}

					else if (param == "LOGNAME") paramData = "'"  +  users.getUserName() + "'" ;
				}
			}
		}


		logging.log (logging.getThisLine(),'info', " :param:" + param + " :paramData:" + paramData);
		return paramData;
	},

    parseQuery: function(queryData)
    {
        var result = {};
        result.status = 0;
		result.query = "";
		result.message = "";
		logging.log (logging.getThisLine(),'info', " :queryData:" + queryData);

		logging.log (logging.getThisLine(),'info', "queryData: " + JSON.stringify(queryData));
        var QueryParam = queryData;
		logging.log (logging.getThisLine(),'info', "QueryParam: " + JSON.stringify(QueryParam));
        //if (QueryParam[0] == "_QUERY")
		if ( (QueryParam._QUERY != "") || (QueryParam._STMT != "") )
        {
			//result.query = QueryParam[1];
			result.query = QueryParam._QUERY;

			readStatements();
            var statement = statements[result.query];
//			logging.log (logging.getThisLine(),'info', 'statements:' + JSON.stringify(statements));
//			logging.log (logging.getThisLine(),'info', statements);
			logging.log (logging.getThisLine(),'info', 'result.query:' + result.query + ' statement:' + statement);
			if (typeof statement !== "undefined")
			{

				if (statement.length > 1)
				{
					var newStatement = "";

					for (var i = 0; i < statement.length; i++)
					{
						newStatement = newStatement + statement[i];
					}
					statement = newStatement;
				}
				else
				{
					newStatement = newStatement + statement[0];
					statement = statement[0];
				}
				logging.log (logging.getThisLine(),'info', "statement:****" + statement + "*****:QueryParam._STMT:" + QueryParam._STMT);
				if (statement == ":_STMT")
					statement = QueryParam._STMT;

				logging.log (logging.getThisLine(),'info', "statement:" + statement);
				result.statement = statement;
				var n = statement.search(":");
				if (n != -1)
				{
					var array = statement.split(":");
					var newStatement = "";

					for (var i = 0; i < array.length; i++)
					{
						if (i != 0)
						{
							var n = array[i].search(" ");
							logging.log (logging.getThisLine(),'info', "n:" + n);
							if (n == -1)
								n = array[i].length;
							if (n != -1)
							{
								var param = array[i].slice(0, n);
								var CommaPart = "";
								if (param.charAt(param.length-1) == ",")
								{
									param = param.slice(0, param.length-1);
									CommaPart = "," ;
								}
								logging.log (logging.getThisLine(),'info', "param:" + param);
								
								var paramData = this.getParamData(statement, queryData,param);
								var phrasePart = array[i].slice(n);
								logging.log (logging.getThisLine(),'info', "phrasePart:" + phrasePart);
								var phrase = paramData + CommaPart + phrasePart;

								/*if (paramData != "")
								{
									var phrasePart = array[i].slice(n);
									var phrase = paramData + phrasePart;
								}
								else
								{
									result.status = 1;
									result.message = "param '" + param + "' not found in statement :\n" + statement + "\nand data :\n" + queryData;
									break;
								}*/
							}
						}
						else
						{
							var phrase = array[i];
						}
						newStatement = newStatement + phrase;
					}
					result.statement = newStatement;
				}
			}
			else
			{
				result.status = 1;
				result.message = "statement :  " + QueryParam[1] + " not found";
			}

        }
		logging.log (logging.getThisLine(),'info', 'result:' + JSON.stringify(result));

        return result;

    }

};


