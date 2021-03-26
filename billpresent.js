// JavaScript source code

const xml2js = require('xml2js');
var basex = require("./index");

var jsonmain = "";
var querymain = "";
var allRowsmain = [];


function printmain(err, reply) {
    var result = "";
    allRowsmain = [];
    var str = reply.result;
    //  console.log("Replylength:,reply",str,str.length); 
    if (err || str.length == 0) {
        console.log("Error: " + err);
        jsonmain = "null";
    } else {
        // console.log("Reply: ",reply.result);

     //   console.log("Reply1: ", str.length);
        for (var i = 0; i < str.length; i++) {
            result = xml2js.parseString(str[i], {
                mergeAttrs: true
            }, (err, result) => {

                if (err) {
                    throw err;
                }
                jsonmain = JSON.stringify(result, null, 4);
                // console.log("JSONBASEX",jsonbasex);

                obj = JSON.parse(jsonmain);

                output1 = obj.ACC_INFO.ACC_NO;
                output2 = obj.ACC_INFO.NAME;
                output3 = obj.ACC_INFO.INVOICE_DATE;
                output4 = obj.ACC_INFO.INVOICE_DATE;
                var cnt = obj.ACC_INFO.SUB_INFO.length;

                for (var i = 0; i < cnt; i++) {

                    output5 = obj.ACC_INFO.SUB_INFO[i].SUB_NO;

                    if (output5 == sub_no) {
                        output5 = obj.ACC_INFO.SUB_INFO[i].IV_NO;
                        output6 = obj.ACC_INFO.SUB_INFO[i].AMOUNT;
                        break;
                    }

                }


                querymain = {
                    "CONTRNO": obj.ACC_INFO.ACC_NO,
                    "NAME": obj.ACC_INFO.NAME,
                    "INVOICE_DATE": obj.ACC_INFO.INVOICE_DATE,
                    "BILLING_PERIOD": obj.ACC_INFO.BILLING_PERIOD,
                    "IV_NO": output5,
                    "DUE_DATE": obj.ACC_INFO.DUE_DATE,
                    "AMOUNT": output6,
                    "TOT_SUB_INV": obj.ACC_INFO.TOT_SUB_INV,
                    "OPEN_BAL": obj.ACC_INFO.PREV_BAL,
                    "CLOSED_BAL": obj.ACC_INFO.TOT_NET_PAID,
                    "STATM_NO": obj.ACC_INFO.INVOICE_NO
                }

                allRowsmain.push(querymain);




            });

        }




       
    }

};



module.exports = {
 
    exec_querymain: function(invd, sub,sub_inside, res)
  {
		var t0 = new Date();
   //  console.log("entered user_invoice:" , t0);
    var client = new basex.Session("localhost", 1984, "admin", "admin");
    
     sub_no = sub_inside;

    var i, j;
    
    var inputquery = 'for $subno in db:open("xml")//STATEMENT ' +
        ' where $subno/CONTRACT/ACC_INFO/INVOICE_DATE=' + invd + ' and $subno/CONTRACT/ACC_INFO/SUB_INFO/@SUB_NO=' + sub + ' return $subno/CONTRACT/ACC_INFO';
    var query = client.query(inputquery);
    query.results(printmain);

    var rr = invd.substring(4, 9);

    client.close(function() {

        var t2 = new Date();



        if (jsonmain === "null" || querymain.length == 0) {
            res.status(400).json({
                "error": "Invalid Data"
            });
        } else {

        
            res.json({
                "data": querymain
            })
            // console.log("sent user_invoice in ", t2 - t0, " milliseconds.");

        }

    });

},


exec_query_subno: function (sub,sub_inside, res) {
    var t0 = new Date();
   //  console.log("entered user_invoice:" , t0);
    var client = new basex.Session("localhost", 1984, "admin", "admin");
    
     sub_no = sub_inside;

    var i, j;

 //  console.log("SUBNO INSIDE",sub);

    var inputquery = 'for $subno in db:open("xml")//STATEMENT ' +
        ' where $subno/CONTRACT/ACC_INFO/SUB_INFO/@SUB_NO=' + sub + ' return $subno/CONTRACT/ACC_INFO/INVOICE_DATE';


    
    

    var query = client.query(inputquery);
    query.results(function(e, r) {
        var t3 = new Date();
    

        var str = r.result;
        err = e;
     
        if (err || str.length == 0) {
            console.log("Error: " + err);
            res.status(400).json({
                "error": "Invalid or no Data found"
            });
        } else {
          
            res.json({
                "data": str
            })
        }
        var t2 = new Date();
   
    });
    query.close();
    client.close();
},


exec_query_contrno: function (sub,sub_inside, res) {
    var t0 = new Date();
    // console.log("entered user_invoice:" , t0);
    var client = new basex.Session("localhost", 1984, "admin", "admin");
    
     sub_no = sub_inside;

    var i, j;

 //  console.log("SUBNO INSIDE",sub);

    var inputquery = 'for $subno in db:open("xml")//STATEMENT ' +
        ' where $subno/CONTRACT/ACC_INFO/ACC_NO = ' + sub + ' return $subno/CONTRACT/ACC_INFO/INVOICE_DATE';
    var query = client.query(inputquery);
    query.results(function(e, r) {
        var t3 = new Date();
        var str = r.result;
        err = e;
       
        if (err || str.length == 0) {
            console.log("Error: " + err);
            res.status(400).json({
                "error": "Invalid or no Data found"
            });
        } else {
          
            res.json({
                "data": str
            })
        }
        var t2 = new Date();
  
    });
    query.close();
    client.close();
},


exec_querycontinfo: function (invd, sub, res) {
    var t0 = new Date();
 
    var client = new basex.Session("localhost", 1984, "admin", "admin");

    var i, j;
    inputquery = 'for $subno in db:open("xml")//STATEMENT' +
                ' where $subno/CONTRACT/ACC_INFO/INVOICE_DATE=' + invd + ' and $subno/CONTRACT/ACC_INFO/ACC_NO =' + sub  + '  return $subno/CONTRACT/ACC_INFO';

    var query = client.query(inputquery);
     query.results(function(e, r) {
        var t3 = new Date();

        var str = r.result;
        err = e;
        if (err || str.length == 0) {
      
            res.status(400).json({
                "error": "Invalid or no Data found"
            });
        } else {
         
            res.json({
                "data": str
            })
        }
        var t2 = new Date();
    
    });
    query.close();
    client.close();
},
exec_querytax: function (sub, res) {
    var t0 = new Date();
 //   console.log("entered services:" , t0);
    var client = new basex.Session("localhost", 1984, "admin", "admin");

    var i, j;


   
   
    inputquery = 'for $subno in db:open("xml")//STATEMENT/CONTRACT/SUB_BILL' +
                ' where  $subno/SUB_DETAIL/@IV_NO =' + sub  + ' return $subno/SUB_DETAIL';


    //  console.log(inputquery)

    var query = client.query(inputquery);
     query.results(function(e, r) {
        var t3 = new Date();
     //   console.log("post data results", t3);

        var str = r.result;
        err = e;


       
        //console.log(reply);
        if (err || str.length == 0) {
        //    console.log("Error: " + err);
            res.status(400).json({
                "error": "Invalid or no Data found"
            });
        } else {
            //console.log(reply);
            res.json({
                "data": str
            })
        }
        var t2 = new Date();
    //    console.log("sent data calls in ", t2 - t0, " milliseconds.");
    });
    query.close();
    client.close();
},


exec_contrno: function (invd, sub, res) {
    var t0 = new Date();
 //   console.log("entered services:" , t0);
    var client = new basex.Session("localhost", 1984, "admin", "admin");

    var i, j;


   
   
    inputquery = 'for $subno in db:open("xml")//STATEMENT' +
                ' where $subno/CONTRACT/ACC_INFO/INVOICE_DATE=' + invd  + ' and $subno/CONTRACT/ACC_INFO/ACC_NO =' +  sub + ' return  $subno/CONTRACT/ACC_INFO/SUB_INFO ';


     // console.log(inputquery)

    var query = client.query(inputquery);
     query.results(function(e, r) {
        var t3 = new Date();
     //   console.log("post data results", t3);

        var str = r.result;
        err = e;


       
        //console.log(reply);
        if (err || str.length == 0) {
        //    console.log("Error: " + err);
            res.status(400).json({
                "error": "Invalid or no Data found"
            });
        } else {
          //  console.log(str);
            res.json({
                "data": str
            })
        }
        var t2 = new Date();
    //    console.log("sent data calls in ", t2 - t0, " milliseconds.");
    });
    query.close();
    client.close();
},


exec_querysum: function (sub, res) {
    var t0 = new Date();
 //   console.log("entered services:" , t0);
    var client = new basex.Session("localhost", 1984, "admin", "admin");

    var i, j;


   
   
  var inputquery = 'for $subno in db:open("xml")//STATEMENT/CONTRACT/SUB_BILL ' +
              ' where  $subno/SUB_DETAIL/@IV_NO =' + sub  + ' return  $subno/SERVICE[@TYPE !="F" ]/DETAILS[@DESCRIPTION !="WIMAX"]';


    //  console.log(inputquery)

    

    var query = client.query(inputquery);
     query.results(function(e, r) {
        var t3 = new Date();
     //   console.log("post data results", t3);

        var str = r.result;
        err = e;

       //  console.log("What is wrong here",str.length,err);
       
        //console.log(reply);
        if ( str.length == 0) {
        //    console.log("Error: " + err);
            res.status(400).json({
                "error": "Invalid or no Data found"
            });
        } else {
         //   console.log(str);
            res.json({
                "data": str
            })
        }
        var t2 = new Date();
    //    console.log("sent data calls in ", t2 - t0, " milliseconds.");
    });
    query.close();
   client.close();
},


exec_querydetdata: function (invd, sub, res) {
    var t0 = new Date();
  //  console.log("entered data:" , t0);
    var client = new basex.Session("localhost", 1984, "admin", "admin");

    var i, j;


    var inputquery = 'for $subno in db:open(  "xml")/STATEMENT[1]/CONTRACT[1]/SUB_BILL[1]' +
    //  ' where $subno/SUB_DETAIL/@IV_NO = ' + sub + ' return  $subno/SERVICE[@TYPE ="F" ]/DETAILS[@NUMBER = "LTEGPRS"]';
   ' where $subno/SUB_DETAIL[1]/@IV_NO = ' + sub + ' return  $subno/SERVICE[@TYPE ="F" ]/DETAILS[@NUMBER = "LTEGPRS" ]';
   //  ' where $subno/SUB_DETAIL[1]/@IV_NO = ' + sub + ' return  $subno/SERVICE[@TYPE ="F" ]/DETAILS[@NUMBER = "LTEGPRS" and @DATE = ' + invd + ' ]';


   //  console.log(inputquery)

    var query = client.query(inputquery);
    query.results(function(e, r) {
        var t3 = new Date();
     //   console.log("post data results", t3);

        var str = r.result;
       // var json = xml2js.parseString(str)
        err = e;
     //    console.log("strlength",str.length);

     
   //  res.setHeader('Content-Encoding', 'default');
 //  res.setHeader('Accept-Encoding', 'gzip', 'deflate');
 //    res.setHeader('Content-Encoding', 'gzip');
        if (err || str.length == 0) {
        //    console.log("Error: " + err);
            res.status(400).json({
                "error": "Invalid or no Data found"
            });
        } else {
         //    console.log("strlength",str.length);
       
            res.json({
                "data": str
            })
        }
        var t2 = new Date();
    //    console.log("sent data calls in ", t2 - t0, " milliseconds.");
    });
    query.close();
    client.close();
},

exec_querydetvoice: function (sub, res) {
    var t0 = new Date();
   // console.log("entered voice:" , t0);
    var client = new basex.Session("localhost", 1984, "admin", "admin");

    var i, j;

    var inputquery = 'for $subno in db:open(  "xml")//STATEMENT/CONTRACT/SUB_BILL' +
          ' where $subno/SUB_DETAIL/@IV_NO = ' + sub  + ' return  $subno/SERVICE[@TYPE ="F" ]/DETAILS[@NUMBER != "LTEGPRS"]';


   //  console.log(inputquery)

    var query = client.query(inputquery);
    query.results(function(e, r) {
        var t3 = new Date();
    //    console.log("post voice results:r.result.length" + r.result.length, t3);

        var str = r.result;
        err = e;
        //console.log(reply);
        if (err || str.length == 0) {
            console.log("Error: " + err);
            res.status(400).json({
                "error": "Invalid or no Data found"
            });
        } else {
            // console.log(reply);
            res.json({
                "data": str
            })
        }
        var t2 = new Date();
    //    console.log("sent voice calls in ", t2 - t0, " milliseconds.");
    });
    query.close();
    client.close();
},

exec_querysubno: function (sub, res) {
    var t0 = new Date();
 //   console.log("entered voice:" , t0);
    var client = new basex.Session("localhost", 1984, "admin", "admin");

    var i, j;



    var inputquery = 'for $subno in db:open("xml")//STATEMENT' +
        ' where $subno/CONTRACT/ACC_INFO/SUB_INFO/@SUB_NO= ' + sub +
        ' return $subno/CONTRACT/ACC_INFO/SUB_INFO';


    // console.log(inputquery)

    var query = client.query(inputquery);
    query.results(function(e, r) {
        var t3 = new Date();
       //  console.log("post subno results:r.result.length" + r.result.length, t3);

        var str = r.result;
        err = e;
        //console.log(reply);
        if (err || str.length == 0) {
            console.log("Error: " + err);
            res.status(400).json({
                "error": "Invalid or no Data found"
            });
        } else {
            // console.log(reply);
            res.json({
                "data": str
            })
        }
        var t2 = new Date();
    //    console.log("sent subno calls in ", t2 - t0, " milliseconds.");
    });
    query.close();
    client.close();
},
exec_queryaccount: function (sub, res) {
    var t0 = new Date();
 //   console.log("entered voice:" , t0);
    var client = new basex.Session("localhost", 1984, "admin", "admin");

    var i, j;



    var inputquery = 'for $subno in db:open("xml")//STATEMENT' +
        ' where $subno/CONTRACT/ACC_INFO/ACC_NO = ' + sub +
        ' return $subno/CONTRACT/ACC_INFO';


    // console.log(inputquery)

    var query = client.query(inputquery);
    query.results(function(e, r) {
        var t3 = new Date();
       //  console.log("post subno results:r.result.length" + r.result.length, t3);

        var str = r.result;
        err = e;
        //console.log(reply);
        if (err || str.length == 0) {
            console.log("Error: " + err);
            res.status(400).json({
                "error": "Invalid or no Data found"
            });
        } else {
            // console.log(reply);
            res.json({
                "data": str
            })
        }
        var t2 = new Date();
    //    console.log("sent subno calls in ", t2 - t0, " milliseconds.");
    });
    query.close();
    client.close();
},

exec_queryinvstat: function (invd, sub,res) {
    var t0 = new Date();
 //   console.log("entered charts:" , t0);
    var client = new basex.Session("localhost", 1984, "admin", "admin");

    var i, j;
    var start_d="";
    var end_d="";
    var querychart="";
    var allRowschart="";
    var dd1=0;
    var glob_query="";


var inputquery = 'for $subno in db:open(  "xml")//STATEMENT/CONTRACT/SUB_BILL' +
//                ' where  $subno/SUB_DETAIL/@IV_NO = ' + sub + ' return  sum($subno/SERVICE[@TYPE ="C" ]/DETAILS[@DESCRIPTION != "Roaming Calls"]/@AMOUNT)';
' where  $subno/SUB_DETAIL/@IV_NO = ' + sub + ' return  sum($subno/SERVICE[@TYPE ="C" ]/DETAILS/@AMOUNT)';
    glob_query = inputquery;
     
    

      inputquery = 'for $subno in db:open(  "xml")//STATEMENT/CONTRACT/SUB_BILL' +
               ' where  $subno/SUB_DETAIL/@IV_NO = ' + sub + ' return  sum($subno/SERVICE[@TYPE ="E" ]/DETAILS/@AMOUNT)';

         glob_query += ' , ' + inputquery;
        
         inputquery = 'for $subno in db:open(  "xml")//STATEMENT/CONTRACT/SUB_BILL' +
               ' where  $subno/SUB_DETAIL/@IV_NO = ' + sub + ' return  sum($subno/SERVICE[@TYPE ="D" ]/DETAILS/@AMOUNT)';

        glob_query += ' , ' + inputquery;

    var query = client.query(glob_query);
    query.results(function(e, r) {
        var t3 = new Date();
    

        var str = r.result;

    
      
        
        err = e;
       
       var q_temp="";

        if (err || str.length ==0 ) {

          querychart = {
            "data": [0,0,0]
                       }

            
            
           

           
                 
        }

        else 
        {
        

          var    value1 =   Number(str[0]).toFixed(4);
          var   value2 =   Number(str[1]).toFixed(4);
          var  value3 =   Number(str[2]).toFixed(4);
          
           
         querychart = {
            "data": [value1,value2,value3]
                       }



    res.json({
                "data": querychart
            })

      }

       
           
       

        var t2 = new Date();
   
    });

   

    query.close();
    client.close();
},


exec_querystatement: function (invd, sub, res) {
    var t0 = new Date();
  //  console.log("entered charts:" , t0);
    var client = new basex.Session("localhost", 1984, "admin", "admin");

    var i, j;


    var inputquery = 'for $subno in db:open("xml")//STATEMENT ' +
        ' where $subno/CONTRACT/ACC_INFO/INVOICE_DATE= ' + invd +
        ' and $subno/CONTRACT/ACC_INFO/SUB_INFO/@SUB_NO= ' + sub +  ' return $subno/CONTRACT/ACC_INFO/SUB_INFO';


  //  console.log("before start query charts at ", t0);
    var query = client.query(inputquery);
    query.results(function(e, r) {
      //  console.log("post charts results", t3);

        var str = r.result;
        err = e;
        //console.log(reply);
        if (err || str.length == 0) {
            console.log("Error: " + err);
            res.status(400).json({
                "error": "Invalid or no Data found"
            });
        } else {
            //console.log(reply);
            res.json({
                "data": str
            })
        }
        var t2 = new Date();
    //    console.log("sent charts in ", t2 - t0, " milliseconds.");
    });
    query.close();
    client.close();
},


exec_checkvoice: function (invd, sub, res) {
    var t0 = new Date();
  //  console.log("entered charts:" , t0);
    var client = new basex.Session("localhost", 1984, "admin", "admin");

    var i, j;

   // console.log("CHECKVOICE",invd,sub);

    var inputquery = 'for $subno in db:open(  "xml")//STATEMENT/CONTRACT/SUB_BILL ' +
        ' where db:open("xml")//STATEMENT/CONTRACT/ACC_INFO/INVOICE_DATE= ' + invd +
        ' and  $subno/SUB_DETAIL/@IV_NO = ' + sub +  ' return  $subno/SERVICE/DETAILS[@DESCRIPTION = "Local Calls (MTN - MTN)"] ';


 
    var query = client.query(inputquery);
    query.results(function(e, r) {
   

        var str = r.result;
        err = e;

      //  console.log("CHECKVOICE",str);
        
        if (err || str.length == 0 || str[0]=='0') {
            console.log("Error: " + err);
            res.status(400).json({
                "error": "Invalid or no Data found"
            });
        } else {
          
            res.json({
                "data": str
            })
        }
        var t2 = new Date();
   
    });
    query.close();
    client.close();
}


};


