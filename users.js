// users.js
// ========
var md5 = require("md5")
var logging = require("./logging.js")

var	authenticate = 1;
var	userName  = "";

function myFunction(rows)
{ 
 for(var i = 0; i < rows.length; i++){ 
  for (var key in rows[i]) {
   if(key.toUpperCase() !== key){
    rows[i][key.toUpperCase()] = rows[i][key];
    delete rows[i][key];
   }
  }

 }

 }



module.exports = {
    getUserName: function()
    {
		return userName;
	},
    Authenticate: function (db, res, authorization)
    {
	var ErrorMsg = "";

	if (!authenticate)
		return ErrorMsg;
	logging.log (logging.getThisLine(),'info', "authorization:" + authorization);
	if ( (authorization == "") ||  (typeof authorization === "undefined") )
	{
		ErrorMsg = "Missing authorization";
	}
	else
	{
		var params = authorization.split(" ");

		if (params[0] == "Basic")
        {
			let buff = new Buffer.from(params[1], 'base64');
			logging.log (logging.getThisLine(),'info', 'buff:' + buff);
			var userPass = buff.toString();
			var authorizationValues = userPass.split(":");

			if (authorizationValues.length > 0)
			{
				var user = authorizationValues[0];
				var password = authorizationValues[1];

				var i = 0;
				ErrorMsg = "User/password not correct ";

				// console.log(usersPassword,user,password);
			
				while ( i < usersPassword.length)
				{
					if (usersPassword[i].USERNAME.toLowerCase() == user.toLowerCase())
					{
						if ( usersPassword[i].PASSWORD == md5(password))
						{
							ErrorMsg = "";
							userName = usersPassword[i].USERNAME.toLowerCase();
							break;
						}
						else
						{
							usersPassword = [];
							console.log("reloading passwords");
							this.setbasicAuth(db);
						}
					}
					i++;
				}
				
			}
		}
		else
		{
			ErrorMsg = "Missing Basic authorization";
		}

	}
	if (ErrorMsg != "")
	{
			logging.log (logging.getThisLine(),'error', 'ErrorMsg2:' + ErrorMsg);
			res.status(400).json({"error":ErrorMsg});
	}
	return ErrorMsg;
    },

    setbasicAuth: function(db)
    {
		var ErrorMsg ="";
		var sql = "select USERNAME ,PASSWORD  from ADM_USER_INFORMATION order by USERNAME";
		var params = [];
		// console.log("HF for users , sql",sql);
		db.query(sql, function  (err, result) 
		{
		//	console.log("HF result:",result);
			if (err)
			{
				logging.log (logging.getThisLine(),'error', 'err:' + err);

				ErrorMsg = err;
				logging.log (logging.getThisLine(),'error', ErrorMsg);
				console.log("HF for users , res and err",result,err);
				process.exit();
				
			}
			var rows = result.rows;
		 	myFunction(rows);
			usersPassword = rows;
			console.log("users loaded :", usersPassword.length);

	  });

    },
    checkToReloadUsers: function(db, queryData)
    {
		//console.log("checkToReloadUsers:");
		var usrQueries = {
			
			   "INSERT_ADM_USER_INFORMATION":1,
			   "UPDATE_ADM_USER_INFORMATION":1,
			   "DELETE_ADM_USER_INFORMATION":1
		};

		var i=1;
		while(i<queryData.length ){
			var qry = queryData[i]._QUERY;
			//console.log("qry:",qry,   " usrQueries[qry]:", usrQueries[qry]);
			if (usrQueries[qry] == 1)
			{
				this.setbasicAuth(db);
				break;
			}

			i++;
		}
	},

};
