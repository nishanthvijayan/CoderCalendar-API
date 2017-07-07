var http = require("http");
var aggregate = require("./aggregate");
var cache = require('memory-cache');

var cacheTTL = 15 * 60 * 1000;

var server = http.createServer(function(req, res){
    var cachedResults = cache.get('results');
    if(cachedResults){
        res.write(JSON.stringify(
            {"results": cachedResults}
        ));
        res.end();
    }else{
        console.log("Cache miss!");
        aggregate().then(function(contests){
            cache.put('results', contests, cacheTTL);
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
    }
});

server.listen(8000);
