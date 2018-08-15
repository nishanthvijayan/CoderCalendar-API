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

const aggregate = function () {
  return axios.all([
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
    .then((contests_by_platform) => {
      let contests = [].concat.apply([], contests_by_platform);

	        // remove contests that are over
	        contests = contests.filter(contest => (contest.end_time > new Date().getTime() / 1000));

	        const ongoing_contests = contests.filter(contest => (contest.start_time < new Date().getTime() / 1000));

	        const upcoming_contests = contests.filter(contest => (contest.start_time > new Date().getTime() / 1000));

	        return {
	        	ongoing: ongoing_contests,
	        	upcoming: upcoming_contests,
	        };
    });
};

module.exports = aggregate;
