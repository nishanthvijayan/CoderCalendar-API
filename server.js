const http = require('http');
const cache = require('memory-cache');
const url = require('url');
const aggregate = require('./aggregate');
const filter = require('./filter');

const CACHE_TTL = 15 * 60 * 1000;

const respondWithResult = (res, results) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ results }));
  res.end();
};

const respondWithError = (res, err) => {
  res.writeHead(500, err.toString());
  res.end();
};

const server = http.createServer((req, res) => {
  const urlParts = url.parse(req.url, true);

  if (urlParts.pathname !== '/') {
    res.writeHead(404);
    res.end();
    return;
  }

  const filterOpts = {
    platform: urlParts.query.platform || null,
    status: urlParts.query.status || null,
  };

  const cachedResults = cache.get('results');
  if (cachedResults) {
    respondWithResult(res, filter(cachedResults, filterOpts));
    return;
  }

  aggregate()
    .then((results) => {
      cache.put('results', results, CACHE_TTL);
      respondWithResult(res, filter(results, filterOpts));
    })
    .catch(error => respondWithError(res, error));
});

server.listen(8000);

module.exports = server;
