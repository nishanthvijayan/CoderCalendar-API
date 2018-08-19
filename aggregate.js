const axios = require('axios');
const codeforces = require('./parsers/codeforces');
const hackerearth = require('./parsers/hackerearth');
const hackerrank = require('./parsers/hackerrank');
const topcoder = require('./parsers/topcoder');
const leetcode = require('./parsers/leetcode');
const codechef = require('./parsers/codechef');
const atcoder = require('./parsers/atcoder');
const csacademy = require('./parsers/csacademy');
const coj = require('./parsers/coj');

const aggregate = () => axios.all([
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
    let contests = [].concat.apply([], contestsByPlatform);

    // remove contests that are over
    const curTime = new Date().getTime() / 1000;
    contests = contests.filter(contest => contest.endTime > curTime);

    const ongoingContests = contests.filter(contest => contest.startTime < curTime);
    const upcomingContests = contests.filter(contest => contest.startTime > curTime);

    return {
      ongoing: ongoingContests,
      upcoming: upcomingContests,
    };
  });

module.exports = aggregate;
