const http = require('http');

http.createServer(function (req, res) {

	res.write("I am a simple node server from ryansikandar.me");
	res.end();
}).listen(3000);

console.log("server started");

