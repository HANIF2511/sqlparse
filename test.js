/*console.log("hello world");
var express = require("express")
var app = express()
var db = require("./database.js")
var logging = require("./logging.js")
var md5 = require("md5")
var sqlparse = require("./sqlparse.js")
var users = require("./users.js")
var sqlTrans = require("./sqlTrans.js")
var bodyParser = require("body-parser");
const config = require('config');
const hostConfig = config.get('Customer.hostConfig');

var Trans = "N";
var limit = -1;
*/

function buildMenu()
{
	var arr = [
	  {
		"choice": "PRVSTAT",
		"text": "Statistics",
		"line": 10,
		"type": "M10"
	  },
	  {
		"choice": "PRVDASH",
		"text": "Dashborad",
		"line": 10,
		"type": "R10"
	  },
	  {
		"choice": "PRVRPRT",
		"text": "Reports",
		"line": 10,
		"type": "R20"
	  },
	  {
		"choice": "PRVSETUP",
		"text": "Setup",
		"line": 20,
		"type": "M20"
	  },
	  {
		"choice": "PRVCMD",
		"text": "Commands setup",
		"line": 20,
		"type": "R10"
	  },
	  {
		"choice": "PRVFLOW",
		"text": "Formatting flow",
		"line": 20,
		"type": "R20"
	  },
	  {
		"choice": "PRVTESTING",
		"text": "Testing",
		"line": 30,
		"type": "M30"
	  },
	  {
		"choice": "PRVTESTF",
		"text": "Test formatting",
		"line": 30,
		"type": "R10"
	  },
	  {
		"choice": "PRVTESTS",
		"text": "Test switch",
		"line": 30,
		"type": "R20"
	  }
	];
	var menu = [];
	var children = [];

	for (var i =0; i< arr.length; i++)
	{
		var type = arr[i].type.charAt(0); 
		if (type == "M")
		{
			if (children.length != 0)
			{
				var item =  {
					title: menuItem.title,
					chice: menuItem.choice,
					children : children
				};
				menu.push(item);
				children = [];
			}
			var menuItem =  {
				title: arr[i].text, 
				choice : arr[i].choice
			};
				//menu.push(item);
		}
		else if (type == "R")
		{
			var routineItem =  {
				title: arr[i].text, 
				choice : arr[i].choice,
				routerLink : "/" + arr[i].choice
			};
			children.push(routineItem);
			console.log("---children");
			console.log(children);
		}


	}
	if (children.length != 0)
	{
		var item =  {
			title: menuItem.title,
			chice: menuItem.choice,
			children : children
		};
		menu.push(item);
		children = [];
	}

	console.log (JSON.stringify(menu));
}

////////////////////////

function testKeys()
{
	function setComponentConfig(componentConfig,screenConfig )
	{
	var keys = Object.keys(componentConfig);
	for (var i =0; i < keys.length; i++)
		{
			console.log( keys[i] + " " + componentConfig[ keys[i] ] ) ;
			if (componentConfig[ keys[i] ] != null)
			{
				screenConfig[ keys[i] ] = componentConfig[ keys[i] ];
			}
		}
	console.log(screenConfig);

	//delete VarsArry[x[0]]; 
	//VarsArry = Object.assign(Avar, VarsArry);
	}
	var componentConfig = {
	  "showToolBar": null,
	  "masterSaved": null,
	  "parentClose": null,
	  "formMode": null,
	  "savingMode": null,
	  "isMaster": null,
	  "isChild": null,
	  "masterKey": null,
	  "AUTH_TYPE": "G",
	  "formattedWhere": null,
	  "clearComponent": null,
	  "otherMasterKey": null,
	  "gridHeight": "450"
	};
	var screenConfig = {
	  "showToolBar": null,
	  "masterSaved": null,
	  "parentClose": null,
	  "formMode": null,
	  "savingMode": null,
	  "isMaster": null,
	  "isChild": null,
	  "masterKey": null,
	  "AUTH_TYPE": "G",
	  "formattedWhere": null,
	  "clearComponent": null,
	  "otherMasterKey": null,
	  "gridHeight": null
	};
	
	//setComponentConfig(componentConfig, screenConfig);
	screenConfig = componentConfig;
	console.log(screenConfig);



}

function buildTree1(treeData)
{
	var parents = 0;
	var aParent = 0;
	var itemsMain = [];
	var item ={};
	var itemsMain = {
			"text": "main",
			items: []
	};
	var items = itemsMain.items;
	var ptr = 0;
	itemsStack = [];
	ptrStack = [];

	for (var i=0 ; i< treeData.length;i++)
	{
		//console.log("item:" + treeData[i].DESCRIPTION);

			if ( ( i != treeData.length - 1) && (treeData[i].ENGINE_LEVEL <  treeData[i+1].ENGINE_LEVEL) )
			{
				console.log(parents + "parent:" + treeData[i].DESCRIPTION +  "level:" + treeData[i].ENGINE_LEVEL  +  " level-1:" +  treeData[i-1].ENGINE_LEVEL);
				if (treeData[i].ENGINE_LEVEL   ==  treeData[i-1].ENGINE_LEVEL )
				{
					itemsStack.push(items);
					ptrStack.push(ptr);
					arrItem = {"text": treeData[i].DESCRIPTION,	items: []};
					items.push( arrItem);
//	console.log("10:" + JSON.stringify(items) );
					console.log("ptr:" + ptr);
					items = items[ptr].items;
					ptr = 0;

				}
				else
				{
					console.log("11:ptr:" + ptr + "   "+ JSON.stringify(items) );
					items = itemsStack.pop();
					ptr = ptrStack.pop();

					itemElem = {"text" : treeData[i].DESCRIPTION , items: []};
					items.push(itemElem);
					console.log("11A:ptr:" + ptr + " length :  "+ items.length+ " " + JSON.stringify(items) );
					ptr = items.length-1;

					itemsStack.push(items);
					ptrStack.push(ptr);

					items = items[ptr].items;
					ptr=0;
					console.log("11B*:ptr:" + ptr + "   "+ JSON.stringify(items) );


				}

			}
			else
			{
				if ( (i != 0) && (treeData[i].ENGINE_LEVEL <  treeData[i-1].ENGINE_LEVEL) )
				{
					console.log(parents + "EOF parent @:" + treeData[i].DESCRIPTION);
					items = itemsStack.pop();
					ptr = ptrStack.pop();
				}
				console.log("12:ptr:" + ptr + " length :  "+ items.length+ " " + JSON.stringify(items) );
				itemElem = {"text" : treeData[i].DESCRIPTION };
				items.push(itemElem);
				ptr++;
			}
	}
console.log("---itemsMain");


	console.log( JSON.stringify(itemsMain.items) );
}

  function buildTree(treeData)
    {
      var parents = 0;
      var itemsMain = {
          "text": "main",
          items: []
      };
      var items = itemsMain.items;
      var ptr = 0;
      var itemsStack = [];
      var ptrStack = [];

      for (var i=0 ; i< treeData.length;i++)
      {
        console.log("\n00:item:" + treeData[i].DESCRIPTION);

          if ( ( i != treeData.length - 1) && (treeData[i].ENGINE_LEVEL <  treeData[i+1].ENGINE_LEVEL) )
          {
            console.log("\n10:parent:" + treeData[i].DESCRIPTION +  " level:" + treeData[i].ENGINE_LEVEL  +  " level-1:" +  treeData[i-1].ENGINE_LEVEL);
            if (treeData[i].ENGINE_LEVEL   ==  treeData[i-1].ENGINE_LEVEL )
            {
              itemsStack.push(items);
              ptrStack.push(ptr);
              var arrItemParent = {"text" : treeData[i].DESCRIPTION 
                                    ,items: []};
              items.push( arrItemParent);
			  ptr = items.length-1;
			  console.log("\n10A:ptr:" + ptr + " length :  "+ items.length+ " " + JSON.stringify(items) );

			  items = items[ptr].items;
              ptr = 0;

            }
            else
            {
              console.log("\n11:ptr:" + ptr + "   "+ JSON.stringify(items) );
              items = itemsStack.pop();
              ptr = ptrStack.pop();

              var arrItemParent = {"text" : treeData[i].DESCRIPTION
                                  , items: []};
              items.push(arrItemParent);
              console.log("\n11A:ptr:" + ptr + " length :  "+ items.length+ " " + JSON.stringify(items) );
              ptr = items.length-1;

              itemsStack.push(items);
              ptrStack.push(ptr);

              items = items[ptr].items;
              ptr=0;
              console.log("\n11B*:ptr:" + ptr + "   "+ JSON.stringify(items) );


            }

          }
          else
          {
            if ( (i != 0) && (treeData[i].ENGINE_LEVEL <  treeData[i-1].ENGINE_LEVEL) )
            {
              console.log( "\n12EOF parent @:" + treeData[i].DESCRIPTION + "ptrStack.length:" + ptrStack.length);
              items = itemsStack.pop();
              ptr = ptrStack.pop();
			  console.log ("poped ptr:" + ptr);
			  console.log (items);
            }
            console.log("\n12A:ptr:" + ptr + " items :  "+  JSON.stringify(items) );
            console.log("\n12B:ptr:" + ptr + " length :  "+ items.length+ " " + JSON.stringify(items) );
            var itemElem = {"text" : treeData[i].DESCRIPTION };
            items.push(itemElem);
            ptr++;
          }
      }
    console.log("---itemsMain");


      console.log( JSON.stringify(itemsMain.items) );
      return itemsMain.items;
      //return itemsMain;

}
//buildMenu();
//testKeys();

  var treeData1 = [{"FLOW_CODE":"PRV_BLD","STEP_ID":337,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":70,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"format","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":321,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":80,"ENGINE_PARAM2":"1","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Set Defaults","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":327,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":90,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"Y","DESCRIPTION":"Check Types","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":325,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":100,"ENGINE_PARAM2":"3","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Check SOTYPE, SUBTYPE, FUNCTION and set FUNCTION","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":328,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":110,"ENGINE_PARAM2":"4","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"IF (sp_subtype='P' AND sp_sotype=63) THEN  sp_stat := 40;","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":329,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"CRM_SET_PAGER","ENGINE_PARAM":null,"PROCESSING_ORDER":120,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"get_ric1","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":null,"SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":361,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"CRM_SET_PAGER","ENGINE_PARAM":null,"PROCESSING_ORDER":120,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"get_ric1","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":null,"SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":331,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":130,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"build Commands","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":336,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":140,"ENGINE_PARAM2":"8","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"set CMDNO=1 and paramno =1","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":332,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"EIM_COMMANDS","ENGINE_PARAM":null,"PROCESSING_ORDER":150,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO","IF_FALSE_PARAM":"343","ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Fetch EIM_COMMANDS","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":349,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":160,"ENGINE_PARAM2":"16","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Set TIMEOUT if PARAMNO = 1","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":341,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":170,"ENGINE_PARAM2":"12","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Field value","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":330,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":180,"ENGINE_PARAM2":"5","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Build Command","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":338,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":190,"ENGINE_PARAM2":"9","IF_TRUE":"GOTO","IF_TRUE_PARAM":"332","IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Incremenet Paramno","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":343,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":210,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Get Transno","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":347,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":220,"ENGINE_PARAM2":"15","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO","IF_FALSE_PARAM":"348","ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Check Transno = 0","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":344,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"ADM_IMDUAL","ENGINE_PARAM":null,"PROCESSING_ORDER":230,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Get Transno","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":345,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":240,"ENGINE_PARAM2":"14","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Increment Transno","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":346,"ENGINE_TYPE":"UPD","ENGINE_MODULE":"ADM_IMDUAL","ENGINE_PARAM":null,"PROCESSING_ORDER":250,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Update Transno","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"saven","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"2","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":348,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":275,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Insert Records","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":339,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":280,"ENGINE_PARAM2":"10","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO","IF_FALSE_PARAM":"339","ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Check if COMMAND not blank","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":351,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":285,"ENGINE_PARAM2":"17","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"SKIP_NEXT","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"check if CMDNO = 1","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":350,"ENGINE_TYPE":"LOG","ENGINE_MODULE":"EIM_COMMAND_RECORD","ENGINE_PARAM":null,"PROCESSING_ORDER":290,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"insert into EIM_COMMAND_RECORD","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"saven","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":333,"ENGINE_TYPE":"LOG","ENGINE_MODULE":"EIM_EXECUTED_COMMANDS","ENGINE_PARAM":null,"PROCESSING_ORDER":300,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"insert into EIM_EXECUTED_COMMANDS","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"saven","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":342,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":310,"ENGINE_PARAM2":"13","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"check if Paramno <> 1","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":340,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":320,"ENGINE_PARAM2":"11","IF_TRUE":"GOTO","IF_TRUE_PARAM":"332","IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Increment CMDNO and reset CMDTXT","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":334,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":350,"ENGINE_PARAM2":"6","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Prepare response","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null}];
  var treeData =  [{"FLOW_CODE":"RATING","STEP_ID":3,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"getprefix","ENGINE_PARAM":null,"PROCESSING_ORDER":10,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"Y","DESCRIPTION":"Get Prefix","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":38,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":30,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"CDR Indentification","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":37,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":40,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Initialize Variables","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":5,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":50,"ENGINE_PARAM2":"1","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"extract SN part from CC NDC SN form Subno","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":6,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":70,"ENGINE_PARAM2":"3","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Prepare All Initial values","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":47,"ENGINE_TYPE":"SND","ENGINE_MODULE":"SIMPLUS","ENGINE_PARAM":"SIMPLUS","PROCESSING_ORDER":80,"ENGINE_PARAM2":"1","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"Y","DESCRIPTION":"ss","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"EvaBuild3","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":34,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":90,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Tariff Profile","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":1,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"SUBS","ENGINE_PARAM":null,"PROCESSING_ORDER":100,"ENGINE_PARAM2":null,"IF_TRUE":"GOTO","IF_TRUE_PARAM":"7","IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":"SUBS","DISABLED":"N","DESCRIPTION":"Get Profile based on Subscriber Number","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":4,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":120,"ENGINE_PARAM2":"2","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Check if Sub Tariff Profile Exist","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":2,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"getCont","ENGINE_PARAM":null,"PROCESSING_ORDER":130,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Profile based on Contract Number","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":7,"ENGINE_TYPE":"CDR_G","ENGINE_MODULE":"getCharge","ENGINE_PARAM":"CDR_GROUP_DEF","PROCESSING_ORDER":140,"ENGINE_PARAM2":"FTML","IF_TRUE":"GOTO","IF_TRUE_PARAM":"9","IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Rating Plan for FTML","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter3","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":32,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":160,"ENGINE_PARAM2":"11","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Set Charge Group to ****","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":48,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":170,"ENGINE_PARAM2":"12","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"test1","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":9,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":260,"ENGINE_PARAM2":"4","IF_TRUE":"GOTO","IF_TRUE_PARAM":"10","IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Check for International or Local Calll, and Check for International or Local Calll","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":313,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":270,"ENGINE_PARAM2":"14","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Set default country Code","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":10,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"getDest","ENGINE_PARAM":null,"PROCESSING_ORDER":310,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Country Code from B-Subscriber Number","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":35,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":330,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Peak/Off Peak","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":11,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"gettariffclass","ENGINE_PARAM":null,"PROCESSING_ORDER":340,"ENGINE_PARAM2":null,"IF_TRUE":"SKIP_NEXT","IF_TRUE_PARAM":"2","IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Time of Day Peak / off-Peak","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":12,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":350,"ENGINE_PARAM2":"5","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"If Peak off-Peak not found, then Set Tariff Class to *","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":13,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"gettariffclass","ENGINE_PARAM":null,"PROCESSING_ORDER":360,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Time of Day Peak / off-Peak using *","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":14,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"getparam","ENGINE_PARAM":null,"PROCESSING_ORDER":370,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Call Parameters if to charge it or not","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":36,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":380,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Service Category","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":15,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"getindeb","ENGINE_PARAM":null,"PROCESSING_ORDER":390,"ENGINE_PARAM2":null,"IF_TRUE":"SKIP_NEXT","IF_TRUE_PARAM":"4","IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Service Category for Package Lookup","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":16,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":400,"ENGINE_PARAM2":"6","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"If Service Cateogry not found, then Set IN_SERVICE_CLASS to ***","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":17,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"getindeb","ENGINE_PARAM":null,"PROCESSING_ORDER":410,"ENGINE_PARAM2":null,"IF_TRUE":"SKIP_NEXT","IF_TRUE_PARAM":"2","IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Service Category for Package Lookup","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":18,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":430,"ENGINE_PARAM2":"7","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"If Service Cateogry not found, then Set also IN_SERVICE to ***","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":19,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"getindeb","ENGINE_PARAM":null,"PROCESSING_ORDER":450,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"SKIP_NEXT","IF_FALSE_PARAM":"1","ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Service Category for Package Lookup","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":20,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":460,"ENGINE_PARAM2":"8","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Copy SERVICE_CATEGORY to EQUIP_GROUP","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":21,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"getpkg_info1","ENGINE_PARAM":null,"PROCESSING_ORDER":470,"ENGINE_PARAM2":null,"IF_TRUE":"SKIP_NEXT","IF_TRUE_PARAM":null,"IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Package Information","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":22,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":480,"ENGINE_PARAM2":"9","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Set SEC_GROUP to HANI","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":304,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":482,"ENGINE_PARAM2":"13","IF_TRUE":"GOTO","IF_TRUE_PARAM":"46","IF_FALSE":"GOTO","IF_FALSE_PARAM":"46","ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Test2","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":302,"ENGINE_TYPE":"EXP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":485,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Exception for CDR Identification","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"EvaGenerate","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":303,"ENGINE_TYPE":"LOG","ENGINE_MODULE":"CDR","ENGINE_PARAM":"%FILENAME%_S","PROCESSING_ORDER":490,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"Y","DESCRIPTION":"Log Suspended Calls","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"AFBOOK","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":46,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":495,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Pricing","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":23,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"getrate","ENGINE_PARAM":null,"PROCESSING_ORDER":500,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get the pricing information","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":24,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":510,"ENGINE_PARAM2":"10","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"  Calculate the Price","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":40,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":520,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"Y","DESCRIPTION":"Statistics","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":29,"ENGINE_TYPE":"STM","ENGINE_MODULE":null,"ENGINE_PARAM":"CDR","PROCESSING_ORDER":540,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"Y","DESCRIPTION":"Perform CDR Statistics","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"GRAPH15","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":"N","ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":30,"ENGINE_TYPE":"STM","ENGINE_MODULE":null,"ENGINE_PARAM":"DISC_RATE","PROCESSING_ORDER":550,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"Y","DESCRIPTION":"Discounting","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"GRAPH15","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":"N","ENGINE_PARAM4":"DISC","ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":45,"ENGINE_TYPE":"STM","ENGINE_MODULE":null,"ENGINE_PARAM":"RA_MED","PROCESSING_ORDER":560,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"Y","DESCRIPTION":"Revenue Assurance","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"GRAPH15","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":33,"ENGINE_TYPE":"STM","ENGINE_MODULE":null,"ENGINE_PARAM":"FRM","PROCESSING_ORDER":570,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"Y","DESCRIPTION":"Fraud","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"GRAPH15","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":"N","ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":301,"ENGINE_TYPE":"STM","ENGINE_MODULE":null,"ENGINE_PARAM":"IMI","PROCESSING_ORDER":580,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"Y","DESCRIPTION":"Imei Tracking","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"graph15","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":295,"ENGINE_TYPE":"LOG","ENGINE_MODULE":"CDR","ENGINE_PARAM":"%FILENAME%_P","PROCESSING_ORDER":590,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"Y","DESCRIPTION":"Log CDR","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"AFBOOK","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"RATING","STEP_ID":31,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"RATING","ENGINE_PARAM":"0","PROCESSING_ORDER":600,"ENGINE_PARAM2":"11","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"End and Clean-up","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null}];
//  var treeData = [{"DESCRIPTION": "level1", "ENGINE_LEVEL":1}, {"DESCRIPTION": "level2", "ENGINE_LEVEL":2},{"DESCRIPTION": "level3", "ENGINE_LEVEL":3},{"DESCRIPTION": "level4", "ENGINE_LEVEL":2}]
//	  "FLOW_CODE":"PRV_BLD","STEP_ID":337,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":70,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"format","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":321,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":80,"ENGINE_PARAM2":"1","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Set Defaults","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":327,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":90,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"Y","DESCRIPTION":"Check Types","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":325,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":100,"ENGINE_PARAM2":"3","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Check SOTYPE, SUBTYPE, FUNCTION and set FUNCTION","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":328,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":110,"ENGINE_PARAM2":"4","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"IF (sp_subtype='P' AND sp_sotype=63) THEN  sp_stat := 40;","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":329,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"CRM_SET_PAGER","ENGINE_PARAM":null,"PROCESSING_ORDER":120,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"get_ric1","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":null,"SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":361,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"CRM_SET_PAGER","ENGINE_PARAM":null,"PROCESSING_ORDER":120,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"get_ric1","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":null,"SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":null,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":331,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":130,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"build Commands","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":336,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":140,"ENGINE_PARAM2":"8","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"set CMDNO=1 and paramno =1","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":332,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"EIM_COMMANDS","ENGINE_PARAM":null,"PROCESSING_ORDER":150,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO","IF_FALSE_PARAM":"343","ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Fetch EIM_COMMANDS","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":349,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":160,"ENGINE_PARAM2":"16","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Set TIMEOUT if PARAMNO = 1","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":341,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":170,"ENGINE_PARAM2":"12","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Get Field value","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":330,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":180,"ENGINE_PARAM2":"5","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"Build Command","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":338,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":190,"ENGINE_PARAM2":"9","IF_TRUE":"GOTO","IF_TRUE_PARAM":"332","IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Incremenet Paramno","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":343,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":210,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Get Transno","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":347,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":220,"ENGINE_PARAM2":"15","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO","IF_FALSE_PARAM":"348","ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Check Transno = 0","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":344,"ENGINE_TYPE":"LKP","ENGINE_MODULE":"ADM_IMDUAL","ENGINE_PARAM":null,"PROCESSING_ORDER":230,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Get Transno","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter1","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":345,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":240,"ENGINE_PARAM2":"14","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Increment Transno","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":346,"ENGINE_TYPE":"UPD","ENGINE_MODULE":"ADM_IMDUAL","ENGINE_PARAM":null,"PROCESSING_ORDER":250,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Update Transno","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"saven","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"2","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":348,"ENGINE_TYPE":"GRP","ENGINE_MODULE":null,"ENGINE_PARAM":null,"PROCESSING_ORDER":275,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Insert Records","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"graph16","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":339,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":280,"ENGINE_PARAM2":"10","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO","IF_FALSE_PARAM":"339","ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Check if COMMAND not blank","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":351,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":285,"ENGINE_PARAM2":"17","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"SKIP_NEXT","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"check if CMDNO = 1","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":350,"ENGINE_TYPE":"LOG","ENGINE_MODULE":"EIM_COMMAND_RECORD","ENGINE_PARAM":null,"PROCESSING_ORDER":290,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"insert into EIM_COMMAND_RECORD","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"saven","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":333,"ENGINE_TYPE":"LOG","ENGINE_MODULE":"EIM_EXECUTED_COMMANDS","ENGINE_PARAM":null,"PROCESSING_ORDER":300,"ENGINE_PARAM2":null,"IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":"N","DESCRIPTION":"insert into EIM_EXECUTED_COMMANDS","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":3,"ICON":"saven","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":"1","THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":342,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":310,"ENGINE_PARAM2":"13","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"check if Paramno <> 1","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":340,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":320,"ENGINE_PARAM2":"11","IF_TRUE":"GOTO","IF_TRUE_PARAM":"332","IF_FALSE":"NEXT_STEP","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Increment CMDNO and reset CMDTXT","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":2,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null},{"FLOW_CODE":"PRV_BLD","STEP_ID":334,"ENGINE_TYPE":"LGC","ENGINE_MODULE":"PRV_BLD","ENGINE_PARAM":"0","PROCESSING_ORDER":350,"ENGINE_PARAM2":"6","IF_TRUE":"NEXT_STEP","IF_TRUE_PARAM":null,"IF_FALSE":"GOTO_LAST","IF_FALSE_PARAM":null,"ERROR_CODE":null,"DISABLED":null,"DESCRIPTION":"Prepare response","PARENT_FLOW_CODE":null,"ENGINE_LEVEL":1,"ICON":"filter2","SIM_STATUS":null,"SIM_ICON":null,"ENGINE_PARAM3":null,"THREAD_ENABLE":null,"ENGINE_PARAM4":null,"ENGINE_PARAM5":null,"CATEGORY":null,"PARENT_STEP_ID":0,"CHILD":null,"ENGINE_PARAM6":null}];
  
//buildTree(treeData);
function buildDetailText(detailsData)
{
	for (var i=0;i<detailsData.length; i++)
	{
		//console.log(detailsData[i].LGC_FUNCTION);
		var str = "";
		str = detailsData[i].LGC_FUNCTION + " of " + detailsData[i].LGC_FIELD + " " + detailsData[i].LGC_OPERATION + " "  + detailsData[i].LGC_VALUE;
		console.log(str);

	}
}
var detailsData = [{"data":[{"LGC_MODULE":"PRV_BLD","LGC_TYPE":"0","LGC_CALL_TYPE":"3","LGC_CONDITION":10,"LGC_ITEM":10,"LGC_LGC_MODULE":"","LGC_LGC_TYPE":"","LGC_GROUP":0,"LGC_GROUP_ITEM":0,"LGC_FUNCTION":"VAL","LGC_FIELD":50,"LGC_PERIOD":0,"LGC_LENGTH":5,"LGC_OPERATION":"INSTR","LOG_VALUE_DISP":"","LGC_VALUE_TYPE":0,"LGC_STAT_STR":"","LGC_VALUE":"63,62","LGC_ACTION":"","LGC_REMARK":"","LGC_REASON_CODE":"","LGC_RET":"","LGC_PARENT":"","DISABLED":"N","LOG_OPERATOR":0,"LOG_PARENT":"","LOGNAME":"TABS","LOGDATE":"Tue May 05 00:00:00 2020","LGC_TABLE":"","LGC_FIELD_NAME":"","LGC_VFAL_FIELD":0,"FLEX_FLD1":"","FLEX_FLD2":"","FLEX_FLD3":"","FLEX_FLD4":"","FLEX_FLD5":""},{"LGC_MODULE":"PRV_BLD","LGC_TYPE":"0","LGC_CALL_TYPE":"3","LGC_CONDITION":10,"LGC_ITEM":20,"LGC_LGC_MODULE":"","LGC_LGC_TYPE":"","LGC_GROUP":0,"LGC_GROUP_ITEM":0,"LGC_FUNCTION":"VAL","LGC_FIELD":60,"LGC_PERIOD":0,"LGC_LENGTH":5,"LGC_OPERATION":"INSTR","LOG_VALUE_DISP":"","LGC_VALUE_TYPE":0,"LGC_STAT_STR":"","LGC_VALUE":"P,G","LGC_ACTION":"","LGC_REMARK":"","LGC_REASON_CODE":"","LGC_RET":"","LGC_PARENT":"","DISABLED":"N","LOG_OPERATOR":0,"LOG_PARENT":"","LOGNAME":"TABS","LOGDATE":"Tue May 05 00:00:00 2020","LGC_TABLE":"","LGC_FIELD_NAME":"","LGC_VFAL_FIELD":0,"FLEX_FLD1":"","FLEX_FLD2":"","FLEX_FLD3":"","FLEX_FLD4":"","FLEX_FLD5":""},{"LGC_MODULE":"PRV_BLD","LGC_TYPE":"0","LGC_CALL_TYPE":"3","LGC_CONDITION":10,"LGC_ITEM":30,"LGC_LGC_MODULE":"","LGC_LGC_TYPE":"","LGC_GROUP":0,"LGC_GROUP_ITEM":0,"LGC_FUNCTION":"VAL","LGC_FIELD":70,"LGC_PERIOD":0,"LGC_LENGTH":3,"LGC_OPERATION":"<>","LOG_VALUE_DISP":"","LGC_VALUE_TYPE":0,"LGC_STAT_STR":"","LGC_VALUE":"SER","LGC_ACTION":"","LGC_REMARK":"","LGC_REASON_CODE":"","LGC_RET":"","LGC_PARENT":"","DISABLED":"N","LOG_OPERATOR":0,"LOG_PARENT":"","LOGNAME":"TABS","LOGDATE":"Tue May 05 00:00:00 2020","LGC_TABLE":"","LGC_FIELD_NAME":"","LGC_VFAL_FIELD":0,"FLEX_FLD1":"","FLEX_FLD2":"","FLEX_FLD3":"","FLEX_FLD4":"","FLEX_FLD5":""},{"LGC_MODULE":"PRV_BLD","LGC_TYPE":"0","LGC_CALL_TYPE":"3","LGC_CONDITION":10,"LGC_ITEM":40,"LGC_LGC_MODULE":"","LGC_LGC_TYPE":"","LGC_GROUP":0,"LGC_GROUP_ITEM":0,"LGC_FUNCTION":"LEN","LGC_FIELD":10,"LGC_PERIOD":0,"LGC_LENGTH":10,"LGC_OPERATION":"=","LOG_VALUE_DISP":"","LGC_VALUE_TYPE":0,"LGC_STAT_STR":"","LGC_VALUE":"0","LGC_ACTION":"","LGC_REMARK":"","LGC_REASON_CODE":"","LGC_RET":"","LGC_PARENT":"","DISABLED":"N","LOG_OPERATOR":0,"LOG_PARENT":"","LOGNAME":"TABS","LOGDATE":"Tue May 05 00:00:00 2020","LGC_TABLE":"","LGC_FIELD_NAME":"","LGC_VFAL_FIELD":0,"FLEX_FLD1":"","FLEX_FLD2":"","FLEX_FLD3":"","FLEX_FLD4":"","FLEX_FLD5":""}]}];
//buildDetailText(detailsData[0].data);

function buildGroupText(groupData)
{
	for (var i=0;i<groupData.length; i++)
	{
		console.log(groupData[i].LGC_GROUP_FUNCTION);
		var COPY_LIKE = ["COPY", "MOVE", "CEIL", "SWAP", "HEX2HMS", "TBCD", "HEX2DEC", "DECTS", "INCTS", "DAY2DATE", "FLIP", "HEX2SEC", "HEX2DEC", "SEC2HMS", "UTC", "DATE2NUM", "HEX2HMS", "HEX2SEC"];
		var TIMES_LIKE = ["TIMES", "GMT", "TRIM", "LOOKSET"];

		var str = "";
		if ( (groupData[i].LGC_GROUP_FUNCTION == "SET") || (groupData[i].LGC_GROUP_FUNCTION == "MULT")  )
			str = groupData[i].LGC_GROUP_FUNCTION + " " + groupData[i].LGC_VALUE + " TO " + groupData[i].LGC_FIELD_TO  ;

		else if ( (groupData[i].LGC_GROUP_FUNCTION == "RESET")  )
			str = groupData[i].LGC_GROUP_FUNCTION + "  " + groupData[i].LGC_FIELD_TO  ;

		else if ( TIMES_LIKE.includes(groupData[i].LGC_GROUP_FUNCTION) )
			str = groupData[i].LGC_GROUP_FUNCTION + " TO " + groupData[i].LGC_FIELD_TO  ;

		else if ( (groupData[i].LGC_GROUP_FUNCTION == "REPLACE")  )
			str = groupData[i].LGC_GROUP_FUNCTION + " " + groupData[i].LGC_VALUE + " IN " + groupData[i].LGC_FIELD_FROM  + " WITH " + groupData[i].LGC_VAR2;

		else if ( (groupData[i].LGC_GROUP_FUNCTION == "CONCAT")  )
			str = groupData[i].LGC_GROUP_FUNCTION + " "  + groupData[i].LGC_FIELD_FROM  + " WITH " + groupData[i].LGC_VAR2 + " TO " + groupData[i].LGC_FIELD_TO  ;

		else if (  (groupData[i].LGC_GROUP_FUNCTION == "ADD") )
			str = groupData[i].LGC_GROUP_FUNCTION + " " + groupData[i].LGC_FIELD_FROM + " VALUE OF " + groupData[i].LGC_VALUE + "  TO " + groupData[i].LGC_FIELD_TO;

		else if ( COPY_LIKE.includes(groupData[i].LGC_GROUP_FUNCTION) )
		{
			if (groupData[i].LGC_VAR1_OFFSET != 0)
				str = groupData[i].LGC_GROUP_FUNCTION + " " + groupData[i].LGC_FIELD_FROM + " FROM OFFSET " + groupData[i].LGC_VAR1_OFFSET + "  TO " + groupData[i].LGC_FIELD_TO;
			else
				str = groupData[i].LGC_GROUP_FUNCTION + " " + groupData[i].LGC_FIELD_FROM  + "  TO " + groupData[i].LGC_FIELD_TO;
		}

		console.log("str:" + str);

	}
}

var groupData = [{"data":[{"LGC_MODULE":"PRV_BLD","LGC_TYPE":"0","LGC_GROUP":50,"LGC_GROUP_ITEM":10,"LGC_GROUP_FUNCTION":"SET","LGC_VALUE":"1","LGC_FIELD_FROM":0,"LGC_FIELD_TO":628,"DISABLED":"N","LGC_REMARK":"SET CMDNO = 1","LGC_LEN":2,"LOGNAME":"TABS","LOGDATE":"","LGC_FIELD":140,"LGC_FROM_VAR2":0,"LGC_LEN_VAR2":0,"LGC_PARENT":"","LGC_VAR1":0,"LGC_VAR2":0,"LGC_VAR1_OFFSET":0,"LGC_VAR2_OFFSET":0,"LGC_FIELD_OFFSET":0,"LGC_VAR1_OFFSET_FIELD":"","LGC_GROUP_ORDER":10},{"LGC_MODULE":"PRV_BLD","LGC_TYPE":"0","LGC_GROUP":50,"LGC_GROUP_ITEM":20,"LGC_GROUP_FUNCTION":"RESET","LGC_VALUE":"","LGC_FIELD_FROM":0,"LGC_FIELD_TO":113,"DISABLED":"N","LGC_REMARK":"","LGC_LEN":500,"LOGNAME":"TABS","LOGDATE":"","LGC_FIELD":120,"LGC_FROM_VAR2":0,"LGC_LEN_VAR2":0,"LGC_PARENT":"","LGC_VAR1":0,"LGC_VAR2":0,"LGC_VAR1_OFFSET":0,"LGC_VAR2_OFFSET":0,"LGC_FIELD_OFFSET":0,"LGC_VAR1_OFFSET_FIELD":"","LGC_GROUP_ORDER":20},{"LGC_MODULE":"PRV_BLD","LGC_TYPE":"0","LGC_GROUP":50,"LGC_GROUP_ITEM":30,"LGC_GROUP_FUNCTION":"SET","LGC_VALUE":"1","LGC_FIELD_FROM":0,"LGC_FIELD_TO":678,"DISABLED":"N","LGC_REMARK":"","LGC_LEN":2,"LOGNAME":"TABS","LOGDATE":"","LGC_FIELD":180,"LGC_FROM_VAR2":0,"LGC_LEN_VAR2":0,"LGC_PARENT":"","LGC_VAR1":0,"LGC_VAR2":0,"LGC_VAR1_OFFSET":0,"LGC_VAR2_OFFSET":0,"LGC_FIELD_OFFSET":0,"LGC_VAR1_OFFSET_FIELD":"","LGC_GROUP_ORDER":30}]}];
//var groupData = [{"data":[{"LGC_MODULE":"PRV_BLD","LGC_TYPE":"0","LGC_GROUP":40,"LGC_GROUP_ITEM":5,"LGC_GROUP_FUNCTION":"REPLACE","LGC_VALUE":"~","LGC_FIELD_FROM":633,"LGC_FIELD_TO":633,"DISABLED":"N","LGC_REMARK":"","LGC_LEN":130,"LOGNAME":"TABS","LOGDATE":"","LGC_FIELD":160,"LGC_FROM_VAR2":0,"LGC_LEN_VAR2":0,"LGC_PARENT":"","LGC_VAR1":160,"LGC_VAR2":0,"LGC_VAR1_OFFSET":0,"LGC_VAR2_OFFSET":0,"LGC_FIELD_OFFSET":0,"LGC_VAR1_OFFSET_FIELD":"","LGC_GROUP_ORDER":5},{"LGC_MODULE":"PRV_BLD","LGC_TYPE":"0","LGC_GROUP":40,"LGC_GROUP_ITEM":10,"LGC_GROUP_FUNCTION":"CONCAT","LGC_VALUE":"","LGC_FIELD_FROM":113,"LGC_FIELD_TO":113,"DISABLED":"N","LGC_REMARK":"","LGC_LEN":500,"LOGNAME":"TABS","LOGDATE":"","LGC_FIELD":120,"LGC_FROM_VAR2":633,"LGC_LEN_VAR2":30,"LGC_PARENT":"","LGC_VAR1":120,"LGC_VAR2":160,"LGC_VAR1_OFFSET":0,"LGC_VAR2_OFFSET":0,"LGC_FIELD_OFFSET":0,"LGC_VAR1_OFFSET_FIELD":"","LGC_GROUP_ORDER":10},{"LGC_MODULE":"PRV_BLD","LGC_TYPE":"0","LGC_GROUP":40,"LGC_GROUP_ITEM":20,"LGC_GROUP_FUNCTION":"CONCAT","LGC_VALUE":"","LGC_FIELD_FROM":113,"LGC_FIELD_TO":113,"DISABLED":"N","LGC_REMARK":"","LGC_LEN":500,"LOGNAME":"TABS","LOGDATE":"","LGC_FIELD":120,"LGC_FROM_VAR2":685,"LGC_LEN_VAR2":50,"LGC_PARENT":"","LGC_VAR1":120,"LGC_VAR2":210,"LGC_VAR1_OFFSET":0,"LGC_VAR2_OFFSET":0,"LGC_FIELD_OFFSET":0,"LGC_VAR1_OFFSET_FIELD":"","LGC_GROUP_ORDER":20}]}];
//var groupData = [{"data":[{"LGC_MODULE":"PRV_BLD","LGC_TYPE":"0","LGC_GROUP":60,"LGC_GROUP_ITEM":10,"LGC_GROUP_FUNCTION":"ADD","LGC_VALUE":"1","LGC_FIELD_FROM":678,"LGC_FIELD_TO":678,"DISABLED":"N","LGC_REMARK":"","LGC_LEN":2,"LOGNAME":"TABS","LOGDATE":"","LGC_FIELD":180,"LGC_FROM_VAR2":0,"LGC_LEN_VAR2":0,"LGC_PARENT":"","LGC_VAR1":180,"LGC_VAR2":0,"LGC_VAR1_OFFSET":0,"LGC_VAR2_OFFSET":0,"LGC_FIELD_OFFSET":0,"LGC_VAR1_OFFSET_FIELD":"","LGC_GROUP_ORDER":10},{"LGC_MODULE":"PRV_BLD","LGC_TYPE":"0","LGC_GROUP":60,"LGC_GROUP_ITEM":20,"LGC_GROUP_FUNCTION":"RESET","LGC_VALUE":"","LGC_FIELD_FROM":0,"LGC_FIELD_TO":685,"DISABLED":"N","LGC_REMARK":"","LGC_LEN":50,"LOGNAME":"TABS","LOGDATE":"","LGC_FIELD":210,"LGC_FROM_VAR2":0,"LGC_LEN_VAR2":0,"LGC_PARENT":"","LGC_VAR1":0,"LGC_VAR2":0,"LGC_VAR1_OFFSET":0,"LGC_VAR2_OFFSET":0,"LGC_FIELD_OFFSET":0,"LGC_VAR1_OFFSET_FIELD":"","LGC_GROUP_ORDER":20}]}]
//var groupData = [{"data":[{"LGC_MODULE":"PRV_BLD","LGC_TYPE":"0","LGC_GROUP":100,"LGC_GROUP_ITEM":10,"LGC_GROUP_FUNCTION":"COPY","LGC_VALUE":"","LGC_FIELD_FROM":633,"LGC_FIELD_TO":630,"DISABLED":"N","LGC_REMARK":"","LGC_LEN":3,"LOGNAME":"TABS","LOGDATE":"","LGC_FIELD":150,"LGC_FROM_VAR2":0,"LGC_LEN_VAR2":0,"LGC_PARENT":"","LGC_VAR1":155,"LGC_VAR2":0,"LGC_VAR1_OFFSET":0,"LGC_VAR2_OFFSET":0,"LGC_FIELD_OFFSET":0,"LGC_VAR1_OFFSET_FIELD":"","LGC_GROUP_ORDER":10}]}]
//buildGroupText(groupData[0].data);



var statement = "  SELECT WO_TYPE ,  WO_ORDER_NO ,  SUBNO ,  WO_STATUS ,  DIV ,  DEPT ,  ASSIGNEE_TYPE ,  ASSIGNEE ,  PROMISED_DATE , ORDERED_DATE, COMPLETION_DATE ,  NOTES ,  PARENT_WO_ORDER_NO ,  ORDER_NO ,  ACTUAL_START_DATE , ATTACHMENTS, ACTUAL_END_DATE ,  LOGDATE ,  LOGNAME ,  TEMPLATE_NAME FROM DSP_WORK_ORDERS  WHERE  WO_ORDER_NO = :WO_ORDER_NO";
var params = {};

function getParams(statement, params)
{
	statement = statement.trim();
	var n = statement.toUpperCase().startsWith("SELECT ");
	if (n)
	{
		var phrase1 = statement.toUpperCase().split("SELECT ");
		console.log("phrase1[1]:", phrase1[1]);
		var phrase2 = phrase1[1].toUpperCase().split(" FROM ");
		console.log("phrase2:", phrase2);
		var columns = phrase2[0].toUpperCase().split(",");
		console.log("columns:", columns);
		for (var i = 0; i < columns.length; i++) {
			columns[i] = columns[i].trim();
			params[columns[i]] = columns[i];
		}
		console.log("columns:", columns);
	}

	return params;                  
               

}
//var params = getParams(statement,  params);
//	console.log("params:", params);

var msgResponse = 
   {
      "message":"success",
      "data":[
         {
            "query":"GET_TEMP_EKYC_FLAGS",
            "data":
               {
                  "FINGER":1,
                  "BIO":0,
                  "ID":1
               }
            
         }
      ]
   }

function 	extractResponseData(msgResponse)
{
	function getKey(Elm, elmVal)
	{
		   var keys = Object.keys(Elm);
		   var k =0;
		   var elmObj;
          while ( k < keys.length)
            {
              console.log("[keys[k]:", keys[k]);
			  if (keys[k] == elmVal)
				{
				  var elmName = keys[k];
				  elmObj = Elm[elmName];
				  console.log("elmObj:", elmObj);
				  break;
				}
			  k++;
            }
			return elmObj;
	}

	  var responseMsg = "data.data";

	  var array = responseMsg.split(".");
	for (var i =0; i < array.length; i++)
	{
		var returnKey = getKey(msgResponse, array[i])
		console.log("returnKey.length:", returnKey.length);
		if (returnKey.length == 1)
			msgResponse = returnKey[0];
		else
			msgResponse = returnKey;
			console.log("msgResponse:", msgResponse);

	}



}
//  extractResponseData(msgResponse)

