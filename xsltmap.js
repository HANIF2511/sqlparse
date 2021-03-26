var fs = require('fs');   	
// var libxslt = require('libxslt');	
// var libxmljs = libxslt.libxmljs;	
 var libxslt = "";
 var libxmljs = "";
var convert = require('xml-js');




function xsltMap(documentString,stylesheetString,fn )
{
//var stylesheetString = fs.readFileSync('router.xslt');  	
//var documentString = fs.readFileSync('ecms_router.xml');    	

//var stylesheetString = fs.readFileSync('ContractSearch.xslt');  	
//var documentString = fs.readFileSync('ContractSearch.xml');    	

//var stylesheetString = fs.readFileSync('cmd.xslt');  	
//var documentString = fs.readFileSync('cmd.xml');    	
console.log("---------------insid xsltMap:documentString:",documentString," stylesheetString:", stylesheetString);

var stylesheetObj = libxmljs.parseXml(stylesheetString);	
var stylesheet = libxslt.parse(stylesheetObj);	
var document = libxmljs.parseXml(documentString);	

//sync
const convert = xmlString =>
  stylesheet
    .apply(document)
    .toString()
    .replace(/^<\?xml version="1\.0" encoding="UTF-8"\?>\s+/, "");
//var docSource = fs.readFileSync('ecms_router.xml');  
var docSource = documentString;

var out = convert(docSource);
console.log("out:" + out);

/*
//Async
console.log(" pre apply");

stylesheet.apply(document,  function(err, result){	
	console.log("result:",
		result.toString().replace(/^<\?xml version="1\.0" encoding="UTF-8"\?>\s+/, "")
		);
	console.log("err:",err);

});	
*/
//out = out.split("\n").join("");
//out = out.split("\"").join("");
return out;
}

module.exports = {

	mapData: function(data, xslt)
    {
		var options = {compact: true, ignoreComment: true, spaces: 4};
		var dataArr = {"data": data};
		result = convert.json2xml(dataArr, options);
		result = '<?xml version="1.0" encoding="UTF-8"?>' + result;
		//console.log("--------------dataArr:", dataArr, " result:", result, " xslt:", xslt);

		var out = xsltMap(result, xslt);
		return out;

	},

	mapDataOut: function(data, xslt)
    {
		var options = {compact: true, ignoreComment: true, spaces: 4};
		//result = convert.json2xml(data, options);
		//result = '<?xml version="1.0" encoding="UTF-8"?>' + result;
		var out = xsltMap(data, xslt);


		var array = out.split("\n");
		console.log("array:", array, " array.length:", array.length);
		
		var outArr = {};
		
		for (var i = 0; i < array.length; i++)
		{
			var elem = array[i];
			elem = elem.trim();
			if (elem != "")
			{
				var arrayParam = elem.split(":");
				var param = arrayParam[0];
				param = param.trim();
				var paramData = arrayParam[1];
				paramData = paramData.trim();
				console.log("paramData:", paramData);
				if (typeof paramData !== "undefined")
					paramData = paramData.trim();
				console.log("-----------------------------param:", param, " paramData:", paramData);
				outArr[param] = paramData;
			}
		}

		var outStr = JSON.stringify(outArr)
		console.log("--------------outStr:" + outStr);

		return outStr;

	}

};
