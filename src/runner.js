const axios = require('axios');
const cache = require('memory-cache');
const { flat, getCurrentTimeInSeconds } = require('./utils');

const codeforces = require('./parsers/codeforces');
const hackerearth = require('./parsers/hackerearth');
const hackerrank = require('./parsers/hackerrank');
const topcoder = require('./parsers/topcoder');
const leetcode = require('./parsers/leetcode');
const codechef = require('./parsers/codechef');
const atcoder = require('./parsers/atcoder');
const csacademy = require('./parsers/csacademy');
const coj = require('./parsers/coj');
const kaggle = require('./parsers/kaggle');
const codingninjas = require('./parsers/codingninjas');

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
  kaggle(),
  codingninjas(),
])
  .then((contestsByPlatform) => {
    const contests = flat(contestsByPlatform.filter(it => Array.isArray(it)));
    
    const curTime = getCurrentTimeInSeconds();

    const sortByStartTime = (a, b) => a.startTime - b.startTime;
    const sortByEndTime = (a, b) => a.endTime - b.endTime;
    
    
    const isOngoing = contest => contest.startTime < curTime && contest.endTime > curTime;
    const isUpcoming = contest => contest.startTime > curTime && contest.endTime > curTime;
    const v = contest => contest.startTime ;
    
    const ongoingContests = contests.filter(isOngoing).sort(sortByEndTime);
    const upcomingContests = contests.filter(v).sort(sortByStartTime);
    
    cache.put('results', {
      timestamp: curTime,
      ongoing: ongoingContests,
      upcoming: upcomingContests,
    });
  });

module.exports = runner;
