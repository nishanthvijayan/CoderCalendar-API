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

  respondWithError(res, 'Cache empty');
});

server.listen(8000);

module.exports = server;
