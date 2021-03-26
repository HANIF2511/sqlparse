/*
function connection_execute(SQL) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Data...');
    }, 500);
  });
}
*/
const config = require('config');
const dbConfig = config.get('Customer.db_oracle');
const oracledb = require('oracledb');
var connection;

var db_Star = {
	adapter: dbConfig.adapter,
	host: dbConfig.host,
	port: dbConfig.port,
	database: dbConfig.dbName,
	user: dbConfig.user,
	password: dbConfig.password,
	connectString: dbConfig.connectString
	};
	


module.exports = {
	
	query: async function(SQL, fn) 
	{
		

		if(SQL === "COMMIT" || SQL === "ROLLBACK")
		{
			if(SQL === "COMMIT")
			{
				await connection.commit();
			}
			if(SQL === "ROLLBACK")
			{
				await connection.rollback();
			}

		}
		else
		{

		try {
			//const result = await connection_execute(SQL);
			
			const result = await connection.execute(SQL, [],	{ outFormat: oracledb.OUT_FORMAT_OBJECT }
			
			);
		   // console.log("1.result:", result);
			// myCallback(0, result);
			fn(0, result);

		//	this.on('data', function (SQL) {
		//		console.log("SQL:",SQL);
		//	  })

		  } catch (err) {
			console.error("2.err",err,SQL);
			//  myCallback(err, "");
			  fn(err, result);
		  } 
		}
		  
	}
	
	,
    setConnnection: function(connectionParam)
	{
		connection = connectionParam;
	//	console.log("Connection inside param",connection);
	},
	db_type: function()
	{
		return(db_Star.adapter);
	}
    

}
