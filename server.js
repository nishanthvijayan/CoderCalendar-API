var http = require("http");
var aggregate = require("./aggregate");

var server = http.createServer(function(req, res){
    aggregate().then(function(contests){
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(
        	{"results": contests}
        ));
        res.end();
    })
    .catch(function(error){
    	res.writeHead(500);
    	res.end;
    });
});

server.listen(8000);
