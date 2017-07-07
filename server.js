var http = require("http");
var cache = require('memory-cache');
var url = require('url');
var aggregate = require("./aggregate");
var filter = require('./filter');

var cacheTTL = 15 * 60 * 1000;

var server = http.createServer(function(req, res){
    var params = url.parse(req.url, true).query;
    var options = {
        platform: params.platform || null,
        status: params.status || null
    };

    var cachedResults = cache.get('results');
    if(cachedResults){
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(
            {"results": filter(cachedResults, options)}
        ));
        res.end();
    }else{
        aggregate().then(function(contests){
            cache.put('results', contests, cacheTTL);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify(
                {"results": filter(contests, options)}
            ));
            res.end();
        })
        .catch(function(error){
            console.log(error.toString());
            res.writeHead(500);
            res.end();
        });
    }
});

server.listen(8000);

module.exports = server;
