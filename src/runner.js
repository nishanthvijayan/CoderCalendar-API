const axios = require('axios');
const cache = require('memory-cache');
const { flat } = require('./utils');

const codeforces = require('./parsers/codeforces');
const hackerearth = require('./parsers/hackerearth');
const hackerrank = require('./parsers/hackerrank');
const topcoder = require('./parsers/topcoder');
const leetcode = require('./parsers/leetcode');
const codechef = require('./parsers/codechef');
const atcoder = require('./parsers/atcoder');
const csacademy = require('./parsers/csacademy');
const coj = require('./parsers/coj');

const runner = () => axios.all([
  codeforces(),
  hackerearth(),
  hackerrank(),
  topcoder(),
  leetcode(),
  codechef(),
  atcoder(),
  csacademy(),
  coj(),
])
  .then((contestsByPlatform) => {
    let contests = flat(contestsByPlatform.filter(it => Array.isArray(it)));

    const curTime = new Date().getTime() / 1000;

    // remove contests that are over
    contests = contests.filter(contest => contest.endTime > curTime);

    const ongoingContests = contests.filter(contest => contest.startTime < curTime);
    const upcomingContests = contests.filter(contest => contest.startTime > curTime);

    cache.put('results', {
      timestamp: curTime,
      ongoing: ongoingContests,
      upcoming: upcomingContests,
    });
  });

module.exports = runner;
