const http = require('http');
const url = require('url');
const cache = require('memory-cache');

const respondWithResult = (res, results) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ results }));
  res.end();
};

const respondWithError = (res, err) => {
  res.writeHead(500, err.toString());
  res.end();
};

const filter = (contests, options) => {
  let filteredContests = contests;

  if (options.platform) {
    filteredContests = {
      ongoing: contests.ongoing.filter(contest => contest.platform === options.platform),
      upcoming: contests.upcoming.filter(contest => contest.platform === options.platform),
    };
  }

  if (options.status === 'ongoing') {
    filteredContests = filteredContests.ongoing;
  } else if (options.status === 'upcoming') {
    filteredContests = filteredContests.upcoming;
  }

  return filteredContests;
};

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const { pathname, query } = url.parse(req.url, true);

  if (pathname !== '/') {
    res.writeHead(404);
    res.end();
    return;
  }

  const filterOpts = {
    platform: query.platform || null,
    status: query.status || null,
  };

  const cachedResults = cache.get('results');
  if (cachedResults) {
    respondWithResult(res, filter(cachedResults, filterOpts));
    return;
  }

  respondWithError(res, 'Cache empty');
});

module.exports = server;
