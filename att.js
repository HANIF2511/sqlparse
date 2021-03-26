// att.js
// ========
var fs = require('fs');
var path = require('path');
var mime = require('mime');
const config = require('config');
const hostConfig = config.get('Customer.hostConfig');


const formidable = require('formidable')
var	  attDir = hostConfig.attDir;
var	  tempDir = hostConfig.tempDir;


function createUserTempDir(userName)
{
	var userNameTempDir = "";
	if (!fs.existsSync(attDir)){
		fs.mkdirSync(attDir);
	}
	var userNameDir = attDir + "/" + userName;
	if (!fs.existsSync(userNameDir)){
		fs.mkdirSync(userNameDir);
	}
	var userNameTempDir = userNameDir + "/" + tempDir;
	if (!fs.existsSync(userNameTempDir)){
		fs.mkdirSync(userNameTempDir);
	}
	return userNameTempDir;
}


module.exports = {
	fetchFile: function (req, res, userName)
    {
		var id = req.query.id;
		var attPath = attDir + "/" + userName+ "/" + id;

		var userNameTempDir = createUserTempDir(userName);
		var tempPath = userNameTempDir + "/" + req.query.name;


		console.log(attPath + "--> " + tempPath  );

		fs.copyFile(attPath, tempPath, function (err) {
		  if (err)
			{
			  console.error(err)
			}
		  console.log('Successfully copied')
		})
		
		res.json(
		{
			"message": "success",
			"data": ""
		})

	},

    downloadFile: function (req, res, userName)
    {
		var userNameTempDir = createUserTempDir(userName) ;
		  var file = req.query.name;
	      var filePath = userNameTempDir + "/" + file;
	  fs.exists(filePath, function(exists){
		  if (exists) {   
			console.log("exists:filePath:", filePath);
		   var mimetype = mime.lookup(file);
			res.writeHead(200, {
			  "Content-Type": mimetype,
			  "Content-Disposition" : "attachment; filename=" + file});
			fs.createReadStream(filePath ).pipe(res);
		  } else {
			res.writeHead(400, {"Content-Type": "text/plain"});
			res.end("ERROR File does NOT Exists :" + filePath );
		  }
		});  

	},
	removeFile: function (req, res, userName)
    {
		console.log("inside remove");
		var id = req.query.id;
		var newPath = attDir + "/" + userName + "/" +  id;

		console.log( "removing "  + newPath);


		try {
		  fs.unlinkSync(newPath)
			  console.log(newPath + " file removed");
		  //file removed
		} catch(err) {
		  console.error(err)
		}		
		res.json(
		{
			"message": "success",
			"data": ""
		})
	},
    save: function (req, res, userName)
    {
		var id = req.query.id;
		var userNameTempDir = createUserTempDir(userName);
		var currentPath = userNameTempDir + "/" + req.query.name;
		var newPath = attDir + "/" + userName + "/" + id;

		console.log(currentPath + "  " + newPath);

		fs.rename(currentPath, newPath, function (err) {
		  if (err)
			{
			  console.error(err)
			  //console.log("error renaming");
			  //throw err
			}
		  console.log('Successfully renamed - AKA moved!')
		})
		
		res.json(
		{
			"message": "success",
			"data": ""
		})

	},
	upload: function (req, res, userName)
    {
		/*
		if (req._parsedUrl.query != null)
		{
			var array = req._parsedUrl.query.split("&");
			for (var i = 0; i < array.length; i++)
			{
				param = array[i].split("=");
				param[0] = param[0].toUpperCase();
				param[1] = decodeURI(param[1]).toUpperCase();;
				console.log(param[0] + " " + param[1]);
			}
		}
		*/
		new formidable.IncomingForm().parse(req, (err, fields, files) => {
		if (err) {
		  console.error('Error', err)
		  throw err
		}
		var id = fields.id;

		console.log('Fields', fields)
		console.log('id:', fields.id)
		//console.log('Files', files)

		var userNameTempDir = createUserTempDir(userName);

		for (const file of Object.entries(files)) {
		  //console.log(file[1])
		  console.log("file.name:" + file[1].name)
		  console.log("file.size:" + file[1].size)
		  console.log("file.path:" + file[1].path)
		  console.log("file.lastModifiedDate:" + Date.parse(file[1].lastModifiedDate))
		  var ver = Date.parse(file[1].lastModifiedDate);


			//var newPath = userNameTempDir + "/" + id + "_" + ver + "_" + file[1].name;
			//var newPath = userNameTempDir + "/" + id +  "_" + file[1].name;
			var newPath = userNameTempDir + "/" +  file[1].name;
			if (fs.existsSync(newPath)){
				 console.log( "1 -  removing: " + newPath);
				 fs.unlinkSync(newPath);
			}
			 fs.copyFile(file[1].path, newPath, function (err) {
			  if (err) throw err
			  console.log('2 -   - copied!')
			})
		  		
		}
	  })

		res.json(
		{
			"message": "success",
			"data": ""
		})


    },
    remove: function(req,res)
    {
    }
};
