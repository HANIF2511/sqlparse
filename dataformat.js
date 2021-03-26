// RND : testing data formats
VarsArry ={};
function setAvar (Avar){
	var x = Object.keys(Avar);
	delete VarsArry[x[0]]; 
	VarsArry = Object.assign(Avar, VarsArry);
  }
function getAvar (name){
	console.log (VarsArry[name]);
  }

Avar = {x:1};
setAvar (Avar);
Avar = {y:2};
setAvar (Avar);
Avar = {newvar:[{a:1},{b:2}]};
setAvar (Avar);

getAvar('x');
getAvar('y');
getAvar('newvar');

Avar = {x:0};
setAvar (Avar);
getAvar('x');

  console.log(VarsArry);