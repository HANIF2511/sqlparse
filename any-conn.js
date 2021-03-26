// JavaScript source code
var  anyDB = require('any-db');
const oracledb = require('oracledb');
const config = require('config');
 // const dbConfig = config.get('Customer.db_oracle');
 const dbConfig = config.get('Customer.dbConfig');
//  const dbConfig = config.get('Customer.postgres');

var oracon = require('./ora-conn.js');


//var  anyDB = require('any-db-sqlite3');

var db_sqlite3 = {
adapter: 'sqlite3',
host: '',
port: '',
database: 'db.sqlite3',
user: '',
password: ''
};




var db_my_db_Mysql = {
adapter: 'mysql',
host: 'localhost',
port: '',
database: 'my_db',
user: 'root',
password: 'Ashgan@2020'
};


var db_Star_Mysql = {
adapter: 'mysql',
host: '127.0.0.1',
port: '8306',
database: 'star',
user: 'GLWebMail',
password: ''
};




var db_Star_Sqlite = {
adapter: 'sqlite3',
host: '',
port: '',
database: 'CRC_CAT.db',
user: '',
password: ''
};

var db_Star = {
adapter: dbConfig.adapter,
host: dbConfig.host,
port: dbConfig.port,
database: dbConfig.dbName,
user: dbConfig.user,
password: dbConfig.password,
connectString: dbConfig.connectString
};


// console.log("ORACLE_SID",dbConfig.adapter);

var db;
var connection;




console.log("Establishing Connection with ",db_Star.adapter);

if(dbConfig.adapter == "oracle")
{
      async function run()
      {
      try{
            connection = await oracledb.getConnection(  {
                          user          : db_Star.user, 
                          password      : db_Star.password,
                          connectString : db_Star.connectString
                        });
                       
              connection.execute( `alter session set NLS_DATE_FORMAT = 'YYYY-MM-DD HH24:MI:SS' nls_language = AMERICAN`);

                       					 
                        oracon.setConnnection(connection);
                        
 
                        db = oracon;  
                        
               
                
               
              }
              
              catch (err) {
                  console.error("HF error",err);
              }
         

      }
      run();
      while(connection === undefined) {
            require('deasync').runLoopOnce();             
       }
    

 
}
                      
else
{

 db = anyDB.createConnection(db_Star);

}

module.exports = {
      db: function()
      {
            if(dbConfig.adapter == "oracle")
            {
                  async function run()
                  {
                  try{
                        connection = await oracledb.getConnection(  {
                                      user          : db_Star.user, 
                                      password      : db_Star.password,
                                      connectString : db_Star.connectString
                                    });
                                   
 connection.execute( `alter session set nls_timestamp_format = 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"' nls_language = AMERICAN`);
              
                                                                  
                                    oracon.setConnnection(connection);

                                    //  values (  '2021-02-12T13:27:00.643Z' )
                                    
             
                                    db = oracon;  
                                    
                           
                            
                           
                          }
                          
                          catch (err) {
                              console.error("HF error",err);
                          }
                     
            
                  }
                  run();
                  while(connection === undefined) {
                        require('deasync').runLoopOnce();             
                   }
            }
else
            {
                  db = anyDB.createConnection(db_Star);
            }
            return db;
      },
      Is_ora: function()
      {
            return(dbConfig.adapter);
      }
};







 





