var express = require("express")
const compression = require('compression');
/* https://timonweb.com/javascript/running-expressjs-server-over-https/ */
var https = require('https');
var http = require('http');
var http_to_use = http;
const fs = require('fs'); 
var cors = require('cors')
var mailer = require("nodemailer");
var macaddress = require("macaddress")

var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'hanyf2511@gmail.com',
        pass: 'Ashgan@2020'
    }
};
var transporter = mailer.createTransport(smtpConfig);
var sqlparse = require("./sqlparse.js")
var users = require("./users.js")
var billpresent = require("./billpresent.js")
var sqlTrans = require("./sqlTrans.js")
var bodyParser = require("body-parser");
const config = require('config');
const hostConfig = config.get('Customer.hostConfig');
var cors = require('cors')
var macaddress = require("macaddress")

var userInfo = {
  company: 'www.genovity.com',
  street: '6th October',
  city: 'Cairo',
  state: 'Egypt',
  zip: '100'
};


var app = express();
// compress all responses
app.use(compression());
var any_con = require("./any-conn.js")

var db = any_con.db();
var Is_oracle = any_con.Is_ora();

// console.log("Is_ora=",Is_oracle);

var logging = require("./logging.js")

var md5 = require("md5")
var sqlparse = require("./sqlparse.js")
var users = require("./users.js")
var rules = require("./rules.js")
var att = require("./att.js")
var sqlTrans = require("./sqlTrans.js")
var switchapi = require("./switchapi.js")
var translog = require("./translog.js");
var apistrans = require ("./apistrans.js");
var epmgw = require ("./epmgw.js");

var bodyParser = require("body-parser");


var paramConfig ;
bodyParser = {
  json: {limit: '50mb', extended: true},
  urlencoded: {limit: '50mb', extended: true}
};
/*
app.use(bodyParser.urlencoded(
{
    extended: false
}));

app.use(bodyParser.json());
*/

app.use(cors());
app.use(function(req, res, next) {
        res.setHeader('access-control-allow-origin', '*')
        next();
        });
app.use(express.json({ limit: '200mb' }))
app.use(express.static('attachments'))

var usersPassword = [];

 users.setbasicAuth(db);
 rules.readRules(db);

var HTTP_PORT = hostConfig.port;	//8080
// Start server

if (http_to_use.globalAgent.protocol == "http:" ){
	var httpsOption = {
	};
	}
else
	{
		var key = fs.readFileSync('server.key', 'utf8');
		var cert = fs.readFileSync('server.cert', 'utf8');
		var httpsOption = {
			key: key,
			cert: cert
		//	ca: ca
		};
}


http_to_use.createServer(httpsOption, app).listen(HTTP_PORT, function () {
	console.log("Server running on port :", HTTP_PORT, " ", http_to_use.globalAgent.protocol)
});

/*app.listen(HTTP_PORT, () =>
{
    //console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});*/

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
return(rows);
 }

 function catch_compare(sql)
{
var whereC = "WHERE";
var whereS = "where";
var n1 = sql.search(whereC);
var n2 = sql.search(whereS);

if(n1 != -1  || n2 != -1)
{
var finarray = sql.split("!=");
var results = "";
results = finarray[0];

for(var i=1;i < finarray.length; i++)
{
results += " ::INT4 != " + finarray[i];
}
sql = results;

var res  = results.split(" = ");

if(res != results)
{
var end_ar = "";
end_ar = res[0];
for( i=1;i < res.length; i++)
{
end_ar += " ::INT4 = " + res[i];
}
sql  = end_ar;
}

}
return sql;

}


function sort_allrows(allrows,key)
{
	
		
		 return allrows.sort(function(a, b)
		 {
		  var x = a[key]; var y = b[key];
		  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		 });
		
		
		
}

function processStatements(queryData,res, req)
{
    var allRows = [];
	// https://stackoverflow.com/questions/31426740/how-to-return-many-promises-in-a-loop-and-wait-for-them-all-to-do-other-stuff
	var promises = [];
	var ErrorMsg  = "";
	
	 function doSomethingAsync(query, sql,value) {
		 logging.log (logging.getThisLine(),'info','processing sql:' + sql );
		 
		 var params = [];
		 return new Promise((resolve) => {
			 if (ErrorMsg == "")
			 {
			
			// sql = catch_compare(sql);
		//	var sql1 = sql.replace("AND CHART_ID LIKE '%'", " ");
			//			sql = sql1;

						// sql1 = sql.replace("30", " '30' ");
						// sql = sql1;
			
				// console.log("Hani1db",db);
				// console.log("Hani1dbquery",db.query);
				db.query(sql, function  (err, result) 
				{
					  logging.log (logging.getThisLine(),'info',"Resolving " + value + " err: " + err + " SQL "  +  sql);
				//	  console.log("Value,SQl HF",value,sql);
					  resolve(value);
					  var rows = "";
					  if (typeof result !== "undefined")
					  {
						rows = result.rows;
						// console.log("HF Rows,results",rows,result);

						if(typeof rows === "undefined" )
						{
							rows= [];
						}
						
						rows =  myFunction(rows);
					
					  }
						
						
					if (err)
					{
						logging.log (logging.getThisLine(),'error',"err.message:" + err.message);
					    ErrorMsg = err.toString();
						return;
					}
					
					logging.log (logging.getThisLine(),'info', 'ROWS:CAPITAL_LETTER' + JSON.stringify( rows));
					if (paramConfig.page != "")
					{
						if (paramConfig.page_size != "")
						{
							var startRec = parseInt(paramConfig.page) * parseInt(paramConfig.page_size);
							var endRec = startRec + parseInt(paramConfig.page_size);
							////console.log('startRec:' + startRec + ' endRec:' + endRec);
							rows = rows.slice( startRec, endRec );
						}

					}

					if (paramConfig.limit > 0)
					{
						if (rows.length > paramConfig.limit)
							rows = rows.slice(0, paramConfig.limit);
					}
					
					logging.log (logging.getThisLine(),'info', 'rows: ' + JSON.stringify( rows));
					


					var queryrows = {
					"query": query,
					"data": rows,
					"value": value
					}
					allRows.push(queryrows);
			  });
			 }
	  });
    }
	paramConfig = sqlparse.getParamConfig();

	logging.log (logging.getThisLine(),'info', 'paramConfig: ' +JSON.stringify( paramConfig));




	//console.log("---- pre rules 1:queryData.length:",queryData.length);
	var i=1;
	var status = 0;
	while ( (i<queryData.length ) && (status == 0) ) {
		var statusRec = rules.checkRules(db, req, res, queryData[i], "PRE");
		status = statusRec.status;
		//console.log("---- pre rules 2:statusRec:", statusRec);
		i++;
	}
	if (status != 0)
	{
		  ErrorMsg = statusRec.msg;
		  logging.log (logging.getThisLine(),'error', "ErrorMsg2:" + ErrorMsg);
		  res.status(400).json({"error":ErrorMsg});
		  return;
	}

	for(var i=1;i<queryData.length ;i++){
		logging.log (logging.getThisLine(),'info', "queryData[i]:" + JSON.stringify(queryData[i]));
	}
	if (paramConfig.trans == "Y")
	{
		logging.log (logging.getThisLine(),'info', "TRANS:BEGIN");
		// db.query("BEGIN;").on('data', function (row) {})
		// db.query("BEGIN");
	}
	var logData = [];
	for(var i=1;i<queryData.length ;i++){
		logging.log (logging.getThisLine(),'info', "pre parse");
		result = sqlparse.parseQuery(queryData[i]);
		logging.log (logging.getThisLine(),'info', "post parse");
		if (result.status == 0)
		{
			sql = result.statement;
			query = result.query;
			promises.push(doSomethingAsync(query,sql,i));
			logData.push(queryData[i]);
		}
		else
		{
			logging.log (logging.getThisLine(),'error', "ErrorMsg1:" + ErrorMsg);
			ErrorMsg = result.message;

		}
	}

	if (ErrorMsg == "")
	{

      Promise.all(promises)
          .then((results) => {
			if (ErrorMsg != "")
		    {
				  logging.log (logging.getThisLine(),'error', "ErrorMsg2:" + ErrorMsg);
				  res.status(400).json({"error":ErrorMsg});
				  // this one crashes the DB server as no more transaction
				  /*
				  if(paramConfig.trans == "Y")
				  {
					logging.log (logging.getThisLine(),'info', "TRANS:ROLLBACK1");
					//db.query("ROLLBACK;").on('data', function (row) {})			
				  }
				  */
					
				  return;
		    }
			
			///////////////////

			if(Is_oracle === "oracle")
			{
			allRows =  sort_allrows(allRows, 'value');
			}

			res.json(
			{
				"message": "success",
				"data": allRows
			})
			////console.log("logData:",logData);
			translog.storeLog(db, logData);

			rules.checkToReloadRules(db,  queryData);
			users.checkToReloadUsers(db, queryData);

			for(var i=1;i<queryData.length ;i++){
				rules.checkRules(db, req, res, queryData[i], "POST")
			}




		  })
          .catch((e) => {
              // Handle errors here
          });
	}
	else
	{
		  logging.log (logging.getThisLine(),'error', "ErrorMsg:" + ErrorMsg);
		  res.status(400).json({"error":ErrorMsg});
		  if(paramConfig.trans == "Y")
		  {
				logging.log (logging.getThisLine(),'info', ":TRANS:ROLLBACK2");
				console.log("HF Rollback");

				if(Is_oracle === "oracle")
				{
					db.query("ROLLBACK");
				}
				else
				{
					// db.query("ROLLBACK;").on('data', function (row) {})
					// db.query("ROLLBACK");
				}
			  
		  }

		  return;

	}
	
	if(paramConfig.trans == "Y")
	{
	//	console.log("HF Inside writing to log")
		logging.log (logging.getThisLine(),'info', "TRANS:COMMIT");
	//	console.log("HF commit");
		if(Is_oracle === "oracle")
				{
						// console.log("In commit with HF");
					db.query("COMMIT");
				}
				else
				{
					// db.query("COMMIT;").on('data', function (row) {})
					if(Is_oracle != "sqlite3")
					{
					 db.query("COMMIT;");
					}
				}
		
		// db.query("COMMIT", function  (err, result) {} );
				
		
	}

}

//==========================================
app.post("/token/generate-token", (req, res, next) =>
        {
			token(req, res);
        });

app.post("/switch/format", (req, res, next) =>
        {
			ErrorMsg = users.Authenticate (db,res, req.headers.authorization);
			if (ErrorMsg == "" )
			{
				queryData = sqlparse.parseUrl(req._parsedUrl.query);
				sqlTrans.formatcommand(db,queryData[1], req, res);
			}

			
		});
//========================================== /prov/api
app.options("/prov/api", (req, res, next) =>
{
	respondOptions(req,res);

});		
app.post("/prov/api", (req, res, next) =>
        {
			var ErrorMsg ="";
			//ErrorMsg = users.Authenticate (db,res, req.headers.authorization);
			if (ErrorMsg == "" )
			{
				//console.log("req.body:", req.body);
				//console.log("req._parsedUrl.query:", req._parsedUrl.query);
				queryData = sqlparse.parseUrl(req._parsedUrl.query);
				for (var i=0; i < req.body.length; i++)
				{
					queryData.push(req.body[i]);
				}

				
				var statement;
				//console.log("queryData:", queryData);
				var Query = sqlparse.getParamData(statement, queryData[1],'_QUERY');
				////console.log("Query:", Query);
				if (Query == "'CREATE_ORDER'")
					switchapi.processcommand(db,queryData[1], req, res);
				else if (Query == "'SAVE_ATT'")
				{
					//fs.writeFileSync("body.txt", JSON.stringify(req.body)); 
					//fs.writeFileSync("header.txt", JSON.stringify(req.headers)); 
					//userName = users.getUserName();
					switchapi.processSaveAtt(db,queryData[1], req, res);
				}
				else
				{
					  var ErrorMsg = "Undefined query :"  + Query;
					  logging.log (logging.getThisLine(),'error', "ErrorMsg:" + ErrorMsg);
					  res.status(400).json({"error":ErrorMsg});
				}

			}
		});
		
//========================================== /api

app.get("/api/test", (req, res, next) =>
        {
			sqlTrans.test(req,res);
       
        });

app.get("/api/att", (req, res, next) =>
{

		if (req.query.action == "download")
		{
			att.downloadFile(req, res, req.query.username);
		}

})
app.post("/api/att", (req, res, next) =>
{
	ErrorMsg = users.Authenticate (db,res, req.headers.authorization);
	if (ErrorMsg == "" )
	{
		//var array = req._parsedUrl.query.split("&");
		console.log("-----:", req.query.action);
		userName = users.getUserName();

		if (req.query.action == "upload")
		{
			att.upload(req, res, userName);
		}
		else
		if (req.query.action == "save")
		{
			att.save(req, res, userName);
		}
		else
		if (req.query.action == "remove")
		{
			////console.log("calling  remove");
			att.removeFile(req, res, userName);
		}
		else
		if (req.query.action == "fetch")
		{
			att.fetchFile(req, res, userName);
		}

	}
})
app.post("/api/trans", (req, res, next) =>
        {
			ErrorMsg = users.Authenticate (db,res, req.headers.authorization);
			if (ErrorMsg == "" )
			{
				hostsInfo = rules.getHostsInfo();
				queryData = sqlparse.parseUrl(req._parsedUrl.query);
				for (var i=0; i < req.body.length; i++)
				{
					queryData.push(req.body[i]);
				}
				apistrans.apiSend(db,queryData[1], req, res, hostsInfo);

			}
        });
app.get("/api", (req, res, next) =>
{
	logging.log (logging.getThisLine(),'info', 'in get');
	//users.Authenticate (db,res, req.headers.authorization);
	ErrorMsg = "";
	ErrorMsg = users.Authenticate (db,res, req.headers.authorization);
	
	if (ErrorMsg == "" )
	{
		queryData = sqlparse.parseUrl(req._parsedUrl.query);
		processStatements(queryData,res, req);
	}

	

});
app.post("/api", (req, res, next) =>
{
		//console.log("********************req.headers.authorization:", req.headers);
		//console.log("********************req._parsedUrl.query:",req._parsedUrl.query);

	var upload = false;
	ErrorMsg = users.Authenticate (db,res, req.headers.authorization);
	if (ErrorMsg == "" )
	{
		queryData = sqlparse.parseUrl(req._parsedUrl.query);
		for (var i=0; i < req.body.length; i++)
		{
			queryData.push(req.body[i]);
		}
		processStatements(queryData,res,req);
	}
})
app.put("/api", (req, res, next) =>
{

	ErrorMsg = users.Authenticate (db,res, req.headers.authorization);
	if (ErrorMsg == "" )
	{

		queryData = sqlparse.parseUrl(req._parsedUrl.query);
		for (var i=0; i < req.body.length; i++)
		{
			queryData.push(req.body[i]);
		}
		processStatements(queryData,res,req);
	}
})


app.delete("/api", (req, res, next) =>
{

	ErrorMsg = users.Authenticate (db,res, req.headers.authorization);
	if (ErrorMsg == "" )
	{
		logging.log (logging.getThisLine(),'info', 'ErrorMsg:'+ErrorMsg);

		queryData = sqlparse.parseUrl(req._parsedUrl.query);
		for (var i=0; i < req.body.length; i++)
		{
			queryData.push(req.body[i]);
		}
		processStatements(queryData,res, req);
	}
})
function respondOptions(req,res)
{
	logging.log (logging.getThisLine(),'info',  'in options');
	res.setHeader('access-control-allow-headers', 'authorization,content-type');
	res.setHeader('access-control-allow-origin', '*');
	res.setHeader('access-control-allow-methods', 'OPTIONS,GET,PUT,POST,DELETE');
	
	res.setHeader('vary' , 'Origin, Access-Control-Request-Headers');
	res.setHeader('access-control-allow-credentials', 'true');
    
	res.json(
    {
    })
}
app.options("/api/att", (req, res, next) =>
{
	respondOptions(req,res);

});

app.options("/api", (req, res, next) =>
{
	respondOptions(req,res);
});

// Root path
app.get("/", (req, res, next) =>
{
	//console.log("requesting:" + req._parsedUrl.query );
    res.json(
    {
        "message": "Ok"
    })
});



// billpresent functions

app.get("/billpresent/pressmain", (req, res, next) => {

    var queryString = req._parsedUrl.query;

   
    var array = queryString.split("&");
   //  console.log("pressmain param",array);
    var str1 = array[0].split("=");
    var str2 = array[1].split("=");
    var param3 = str1[1];
    var param1 = '"' + str1[1] + '"';
    var param2 = '"' + str2[1] + '"';

    // exec_query('"31/10/2019"','"0880466210"',res);

    billpresent.exec_querymain(param2, param1, param3,res);

});

app.get("/billpresent/press_subno", (req, res, next) => {

    var queryString = req._parsedUrl.query;
    // console.log("Q=",queryString);
    var array = queryString.split("=");
    var str1 = array[1].split("=");
  
    var param3 = str1[0];
    var param1 = '"' + str1[0] + '"';
      // console.log("STR1",str1,param1);
 

    // exec_query('"31/10/2019"','"0880466210"',res);

    billpresent.exec_query_subno(param1, param3,res);

});

app.get("/billpresent/press_contrno", (req, res, next) => {

    var queryString = req._parsedUrl.query;
    // console.log("Q=",queryString);
    var array = queryString.split("=");
    var str1 = array[1].split("=");
  
    var param3 = str1[0];
    var param1 = '"' + str1[0] + '"';
      // console.log("STR1",str1,param1);
 

    // exec_query('"31/10/2019"','"0880466210"',res);

    billpresent.exec_query_contrno(param1, param3,res);

});



app.get("/billpresent/presscontrinfo", (req, res, next) => {

    var queryString = req._parsedUrl.query;
    var array = queryString.split("&");
    var str1 = array[0].split("=");
    var str2 = array[1].split("=");
    var param1 = '"' + str1[1] + '"';
    var param2 = '"' + str2[1] + '"';

    // exec_query('"31/10/2019"','"0880466210"',res);

    billpresent.exec_querycontinfo(param1, param2, res);

});





app.get("/billpresent/presstax", (req, res, next) => {

    var queryString = req._parsedUrl.query;
    var array = queryString.split("&");
    var str1 = array[0].split("=");
    
    var param1 = '"' + str1[1] + '"';
    

    // exec_query('"31/10/2019"','"0880466210"',res);

    billpresent.exec_querytax(param1, res);

});


app.get("/billpresent/presscontrno", (req, res, next) => {

    var queryString = req._parsedUrl.query;
    var array = queryString.split("&");
    var str1 = array[0].split("=");
    var str2 = array[1].split("=");
    var param1 = '"' + str1[1] + '"';
    var param2 = '"' + str2[1] + '"';

    // exec_query('"31/10/2019"','"0880466210"',res);

    billpresent.exec_contrno(param2, param1, res);

});





app.get("/billpresent/presssum", (req, res, next) => {

    var queryString = req._parsedUrl.query;
    var array = queryString.split("&");
    var str1 = array[0].split("=");
    var str2 = array[1].split("=");
    var param1 = '"' + str1[1] + '"';
    var param2 = '"' + str2[1] + '"';

    // exec_query('"31/10/2019"','"0880466210"',res);

    billpresent.exec_querysum(param1, res);

});




app.get("/billpresent/presssubno", (req, res, next) => {

    var queryString = req._parsedUrl.query;
    var array = queryString.split("&");
    var str1 = array[0].split("=");
    var param1 = '"' + str1[1] + '"';
   

    // exec_query('"31/10/2019"','"0880466210"',res);

    billpresent.exec_querysubno(param1, res);

});

app.get("/billpresent/pressaccount", (req, res, next) => {

    var queryString = req._parsedUrl.query;
    var array = queryString.split("&");
    var str1 = array[0].split("=");
    var param1 = '"' + str1[1] + '"';
   

    // exec_query('"31/10/2019"','"0880466210"',res);

    billpresent.exec_queryaccount(param1, res);

});

app.get("/billpresent/pressdetvoice", (req, res, next) => {

    var queryString = req._parsedUrl.query;
    var array = queryString.split("&");
    var str1 = array[0].split("=");
    var param1 = '"' + str1[1] + '"';

    billpresent.exec_querydetvoice(param1, res);

});

app.get("/billpresent/pressdetdata", (req, res, next) => {
	
	
    var queryString = req._parsedUrl.query;
    var array = queryString.split("&");
    var str1 = array[0].split("=");
    var str2 = array[1].split("=");
    var param1 = '"' + str1[1] + '"';
    var param2 = '"' + str2[1] + '"';

	
   

    billpresent.exec_querydetdata(param2, param1, res);

});

app.get("/billpresent/pressinvstat", (req, res, next) => {

    var queryString = req._parsedUrl.query;
    var array = queryString.split("&");
    var str1 = array[0].split("=");
    var str2 = array[1].split("=");
     var param1 = '"' + str1[1] + '"';
    var param2 = '"' + str2[1] + '"';
    


    // exec_query('"31/10/2019"','"0880466210"',res);

    billpresent.exec_queryinvstat(param2, param1,res);

});
app.get("/billpresent/pressstatement", (req, res, next) => {


    var queryString = req._parsedUrl.query;
    var array = queryString.split("&");
    var str1 = array[0].split("=");
    var str2 = array[1].split("=");
    var param1 = '"' + str1[1] + '"';
    var param2 = '"' + str2[1] + '"';

    // exec_query('"31/10/2019"','"0880466210"',res);

    billpresent.exec_querystatement(param2, param1, res);

});


app.get("/billpresent/presscheckvoice", (req, res, next) => {


    var queryString = req._parsedUrl.query;
    var array = queryString.split("&");
    var str1 = array[0].split("=");
    var str2 = array[1].split("=");
    var param1 = '"' + str1[1] + '"';
    var param2 = '"' + str2[1] + '"';

    // exec_query('"31/10/2019"','"0880466210"',res);

    billpresent.exec_checkvoice(param2, param1, res);

});


app.get("/billpresent/macaddress", (req, res, next) => {

macaddress.one(function (err, mac) {
 // console.log("Mac address for this host: %s", mac);  
   res.json({
                    "message": "success",
                    "data": mac
                })
});



});

app.get("/billpresent/license", (req, res, next) => {

try{
  var license = licenseKey.createLicense(userLicense);
  // console.log(license.license);
   res.json({
                            "data": license.license
                })
}catch(err){
res.status(400).json({
            "error": "Invalid License"
        });
}
});


app.get("/billpresent/email", (req, res, next) => {


var queryString = req._parsedUrl.query;
    var array = queryString.split("&");
    var str1 = array[0].split("=");
     var str2 = array[1].split("=");
 
  let queryData = sqlparse.parseUrl(req._parsedUrl.query);

    // console.log("array",queryData[0].ID);

    let id  = queryData[0].ID;
    let remail = queryData[0].EMAIL;



let body = {
    from: 'hanyf2511@gmail.com',
    to:   remail,
    subject: "Expenses Claim" + " with ID ="  + id,
    text: "Plaintext version of the message",
    html: `<h2> Expenses Claim  waiting your approval </h2> <br>
             <p> Please visit URL: http://gmashro.com:8080/GenovityHR  and login with your ID</p>`

};
 
transporter.sendMail(body,(err,result)=>{
    if(err)
    {
        console.log(err);
        return false;
    }
    console.log(result);
})
});


app.get("/billpresent/passemail", (req, res, next) => {


    var queryString = req._parsedUrl.query;
    var str = queryString.split("&");
    // console.log("AllQ=",str);
       
    
     let str1 = str[0].split("=");
     let remail = str1[1];
     str1 = str[1].split("=");
     let pass = str1[1];
    
    let body = {
        from: 'hanyf2511@gmail.com',
        to:   remail,
        subject: "LonestarCell: Your password",
        text: "Plaintext version of the message" ,
        html: `<h2> Your Password = ${pass} </h2> <br>
                 <p> Please visit URL: http://gmashro.com:8080/mtn_liberia_invoice/ </p>`
    
    };
     
    transporter.sendMail(body,(err,result)=>{
        if(err)
        {
            console.log(err);
            return false;
        }
        console.log(result);
    })
    
    });



//========================================== /epmgw
app.get("/epmgw", (req, res, next) =>
{
	console.log ("req.method:", req.method);
	if ( req.method == "HEAD")
		respondOptions(req,res);
	else
		epmgw.sendRequestToSrv(req, res);
});
app.post("/epmgw", (req, res, next) =>
{
	epmgw.sendRequestToSrv(req, res);
});
app.delete("/epmgw", (req, res, next) =>
{
	epmgw.sendRequestToSrv(req, res);
});
app.put("/epmgw", (req, res, next) =>
{
	epmgw.sendRequestToSrv(req, res);
});
app.options("/epmgw", (req, res, next) =>
{
	respondOptions(req,res);
});

app.head("/epmgw", (req, res, next) =>
{
	respondOptions(req,res);
});
