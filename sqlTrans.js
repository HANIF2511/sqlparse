// sqlTrans.js
// ========
var logging = require("./logging.js")
var sqlparse = require("./sqlparse.js")
module.exports = {
	test: function(req, res)
    {
        var response = [
                        {
                        "userId": 1,
                        "id": 1,
                        "title": "Fuad",
                        "completed": false
                        }];
        res.json(response);
    },
    token: function(req, res)
    {
        console.log(req.body);
        console.log ('in token/generate-token');
        var response = {
         "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTA3NDYwMDYsImV4cCI6MTYyMjI4MjAwNiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.LPofqLV7gtIiINGLcuySoNSc8BZZuYHgYKajPyQ5OmI"};
        res.json(response);
    },
    formatcommand: function(db, queryData, req, res)
    {
		function addCommands(res, db, NewTransno, EIM_COMMANDSrows)
		{
				var CurCMDNO = 0;
				var i = 0;
				var statement = "";
				logging.log (logging.getThisLine(),'info', "EIM_COMMANDSrows : " + EIM_COMMANDSrows);
				while ( i < EIM_COMMANDSrows.length)
				{
					var Command = "";
					CurCMDNO++;
					var TIMEOUT = EIM_COMMANDSrows[0].TIMEOUT;
					while (EIM_COMMANDSrows[i].CMDNO == CurCMDNO)
					{
						EIM_COMMANDSrows[i].CMDTXT = EIM_COMMANDSrows[i].CMDTXT.replace("~", "");

						Command = Command + EIM_COMMANDSrows[i].CMDTXT;
						if (EIM_COMMANDSrows[i].PARAM_FIELD != "")
						{
							var PARAM_FIELD = sqlparse.getParamData(statement,queryData,EIM_COMMANDSrows[i].PARAM_FIELD);
							var PARAM_FIELD = PARAM_FIELD.replace("'","");
							var PARAM_FIELD = PARAM_FIELD.replace("'","")
							Command = Command + PARAM_FIELD;
						}
						i++;
						logging.log (logging.getThisLine(),'info', "EIM_COMMANDSrows[i] : " + EIM_COMMANDSrows[i]);
						if (typeof EIM_COMMANDSrows[i] === "undefined")
							break;
					}
					logging.log (logging.getThisLine(),'info', "Command : " + Command);
					if (Command != "")
					{
						if (CurCMDNO == 1)
						{
							var SUBSCR_TYPE = sqlparse.getParamData(statement, queryData,'SUBSCR_TYPE');
							var AREA		= sqlparse.getParamData(statement, queryData,'AREA');
							var SUBNO		= sqlparse.getParamData(statement, queryData,'SUBNO');
							var SERORDNO	= sqlparse.getParamData(statement, queryData,'SERORDNO');
							var EXC = sqlparse.getParamData(statement, queryData,'EXC');
							var PORTNO = sqlparse.getParamData(statement, queryData,'PORTNO');
							var SPC_FUNCTION = sqlparse.getParamData(statement, queryData,'SPC_FUNCTION');
							var EQUIPID = sqlparse.getParamData(statement, queryData,'EQUIPID');
							var DEVTYPE = "";
							var IMSINO	= sqlparse.getParamData(statement, queryData,'IMSINO');
							var DEVNO = IMSINO.substr(6, 10); 
							var PARAMETER = "";
							var NXTROUTINE = 'SPC001';
							var APPDATE = new Date().toLocaleString().replace(",","").replace(/:.. /," ");
							var RETRANSMIT = "Y"; //  wtrans := 'Y';  if (sp_function = 'LTST'  || p_function = 'METR' ) then wtrans := 'N';
							var TRANSSTATUS = 10;
							var RETRIES = "";
							var PRIORITY = 10;

							var statement = "insert into  EIM_COMMAND_RECORD ";
							statement = statement + " ( SUBSCR_TYPE, AREA, SUBNO, SERORDNO, TRANSNO, EXC, EXCSYSTEM, PORTNO, SPC_FUNCTION, DEVTYPE, DEVNO, PARAMETER,";
							statement = statement + " APPDATE, NXTROUTINE, RETRANSMIT, TRANSSTATUS, EQUIPID, RETRIES, PRIORITY ) ";
							statement = statement + " values ( ?, ? , ? , ? , ? , ? , ?, ? , ? , ?, ? , ?, ? , ?, ?, ?, ?, ?, ? )";
							logging.log (logging.getThisLine(),'info', 'statement:' + statement);

							db.query(statement, [SUBSCR_TYPE, AREA, SUBNO,SERORDNO, NewTransno, EXC, EXCSYSTEM, PORTNO, SPC_FUNCTION, DEVTYPE, DEVNO, PARAMETER,
								                      APPDATE, NXTROUTINE, RETRANSMIT, TRANSSTATUS, EQUIPID, RETRIES, PRIORITY ]).on('data', function (row) {
												console.log("row",row);
												})
						}
							var statement = "insert into  EIM_EXECUTED_COMMANDS ";
							statement = statement + " ( TRANSNO, CMDNO, COMMAND, TIMEOUT) ";
							statement = statement + " values ( ? , ? , ? , ?  )";
							logging.log (logging.getThisLine(),'info', 'statement:' + statement);
							db.query(statement, [NewTransno, CurCMDNO, Command, TIMEOUT]).on('data', function (row) {
												console.log("row",row);
												})

					}
				}
				var response = [
								{
								"message": "success",
								"transno": NewTransno
								}];
				res.json(response);

		}
		var SPC_FUNCTION = sqlparse.getParamData(statement, queryData,'SPC_FUNCTION');
		var EXCSYSTEM = sqlparse.getParamData(statement, queryData,'EXCSYSTEM');
		var EQUIPID = sqlparse.getParamData(statement, queryData,'EQUIPID');

		var statement = "select CMDNO, PARAMNO, PARAM_FIELD, CMDTXT, PARAM_LENGTH, CMD_LANGUAGE, TIMEOUT from EIM_COMMANDS ";
		statement = statement + " where SPC_FUNCTION = " + SPC_FUNCTION ;
		statement = statement + " and   EXCSYSTEM = " + EXCSYSTEM ;
		statement = statement + " and   EQUIPID = " + EQUIPID ;
		statement = statement + " order by CMDNO, paramno";


        var ErrorMsg = "";
		var params = [];
		logging.log (logging.getThisLine(),'info', 'statement:' + statement);
		//db.on('error', function (err) {});
		db.query(statement, function  (err, result) 
		{
			if (err)
			{
				logging.log (logging.getThisLine(),'error',"err:" + err);
				res.status(400).json({"error":err});
			}
			else
			{
				var EIM_COMMANDSrows = result.rows;
				logging.log (logging.getThisLine(),'info', 'EIM_COMMANDSrows:' + JSON.stringify(EIM_COMMANDSrows));
				var statement = "select TRANSNO from ADM_IMDUAL";
				logging.log (logging.getThisLine(),'info', 'statement:' + statement);
				db.query(statement, function  (err, result) 
				{
					if (err)
					{
						logging.log (logging.getThisLine(),'error',"err:" + err);
						res.status(400).json({"error":err});
					}
					else
					{
						var ADM_IMDUAL_row = result.rows;
						var NewTransno = ADM_IMDUAL_row[0].TRANSNO + 1;
						var statement = "update  ADM_IMDUAL set TRANSNO = " + NewTransno;
						logging.log (logging.getThisLine(),'info', 'statement:' + statement);
						db.query(statement, function  (err, result) 
						{
							if (err)
							{
								logging.log (logging.getThisLine(),'error',"err:" + err);
								res.status(400).json({"error":err});
							}
							else
							{
								addCommands(res, db, NewTransno, EIM_COMMANDSrows);
							}
						});

					}
			    });


			}
	
	    });
    }

};


