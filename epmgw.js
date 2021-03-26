
var SimMode = 2; // 1:Simulator(urlhost.mml) , 2:googleapis
//var httpSrv = require("http");

//var https = require('https');
var http = require('http');

var httpToUse = http;

var optionsEpmEng = {
    host: 'gmashro.com',
    port: 8093,
    headers: {
    }
};
function SetURL(request, DataLen) {
    var url = request.url;
    optionsEpmEng.path = url;
    var headers = {
    };

    if (DataLen != 0) {
        headers['Content-Length'] = DataLen;
        
    } 
    optionsEpmEng.headers = headers;

    var headersReq = request.headers;
    //console.log('------------ headersReq:' + JSON.stringify(headersReq));
    if (typeof(contentType) !== 'undefined') {
        var AuthorizationRcvd = headersReq['authorization'];
        optionsEpmEng.headers.authorization = AuthorizationRcvd;
        //console.log('-------------AuthorizationRcvd:' + AuthorizationRcvd);
    }
    

    
    optionsEpmEng.headers["Connection"] = "keep-alive";
    var contentType = headersReq["content-type"];
    //console.log("contentType:" + contentType);
    if (typeof(contentType) !== 'undefined') {
        optionsEpmEng.headers["Content-Type"] = headersReq["content-type"];
    }

}

module.exports = {
    sendRequestToSrv: function(request, responseS) {
        
         var str = '';
            var TimeNow;
            var data = "";
            var DataLen = 0;
            if (request.method != "GET"){
                data = JSON.stringify(request.body); 
                DataLen = data.length ;  
                console.log("---:DataLen:" + DataLen);
            }
            
            console.log("request.body:",request.body)
            //console.log(" request1:", request)
            //data = data.toString();

            TimeNow = Date.now();
            console.log(TimeNow , ":data:" , data);




            SetURL(request, DataLen);
            httpToUse = http;

            OptionToUse = optionsEpmEng;
            OptionToUse.method = request.method;

            //		console.log('request:'+ request);
            //console.log("optionsEpmEng:",optionsEpmEng);

          
                //console.log("----Sending:OptionToUse:", OptionToUse);

                var requestToSrv = httpToUse.request(OptionToUse, function(response) {
                    //another chunk of data has been recieved, so append it to `str`

                    response.on('data', function(chunk) {
                        str += chunk;
                    });

                    //the whole response has been recieved, so we just print it out here
                    response.on('end', function() {
                        //console.log(TimeNow + ":Request ended sending:receiving:" + str);
                        responseS.writeHead(200, {
                            "Content-Type": "application/json; charset=UTF-8"
                        });
                        responseS.write(str);
                        responseS.end();
                    });


                });
                requestToSrv.on('error', function(err) {
                    console.log('----------------------Error:', err);
                    responseS.writeHead(405, {
                        "Content-Type": "application/json; charset=UTF-8"
                    });
                    responseS.write(err.toString());
                    responseS.end();

                });
                if (data.length != 0) {
                    requestToSrv.write(data);
                }

                requestToSrv.end();
            
        }

    }

