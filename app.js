const http = require('http');

http.createServer(function (req,res){

res.write("full stack kinda shit");
	res.end();
}).listen(3000);

console.log("server started");