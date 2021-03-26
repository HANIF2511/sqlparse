// translog.js
// ========
var logging = require("./logging.js")
var db = require("./any-conn.js")
var users = require("./users.js")
const config = require('config');

const loggingmode = config.get('Customer.loggingTrans.loggingmode');





module.exports = {
    storeLog: function (db, logData)
    {
		//console.log("-----here1:loggingmode:,",loggingmode);
		if (loggingmode != "")
		{
			if (logData[0]._QUERY == "VERIFY_ADM_USER")
				return;
			var d = new Date();
			var current = new Date();
			var dateIso = d.toISOString();
			var logDataStr = JSON.stringify(logData);
			const pieces = logDataStr.split("'");
			logDataStr = pieces.join('"');
			//console.log ("logDataStr:" + logDataStr);
			var year = "";
			year += current.getFullYear();
			year += '-';
			year += current.getMonth() + 1;
			year += '-';
			year += current.getDate();
			year += ' ';
			year += current.getHours();
			year += ':';
			year += current.getMinutes();
			year += ':';
			year += current.getSeconds();

			// console.log("Year=",year);

			if (loggingmode == "DB")
			{

				
				var stmt = "insert into  LOG_TRANS ";
				stmt = stmt + " ( LOGDATE, LOGNAME, TRANS) ";
				stmt = stmt + " values (  '" + dateIso + "', '" + users.getUserName() + "' , '" + logDataStr + "' )";
				
			// console.log("stmt:", stmt);
				//console.log("pre insert:");
				
				//db.run(stmt, [logDate, users.getUserName(), logDataStr]);
				db.query(stmt, function  (err, result) 
				{
					if (err)
					{
						console.log( "err saving log:" , err);
					}
					else
					{
						//console.log("added");
						

					}
				});
			}
			else if (loggingmode == "FILE")
			{
				
				//logging.trans ('trans', logDataStr );

			}
		}

	}
};
