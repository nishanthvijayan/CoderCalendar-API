const axios = require('axios');
const { parserErrorHandler, getCurrentTimeInSeconds } = require('./../utils');

const LEETCODE_API_URL = 'https://leetcode.com/contest/api/list/';
const PLATFORM = 'LEETCODE';

const isContestActive = curTime => contest => (contest.start_time + contest.duration) > curTime;

const convertToStandardContest = contest => ({
  name: contest.title,
  url: `https://leetcode.com/contest/${contest.title_slug}`,
  platform: 'leetcode',
  startTime: contest.start_time,
  endTime: contest.start_time + contest.duration,
});

const leetcode = () => axios.get(LEETCODE_API_URL, { timeout: 15000 })
  .then(response => response.data.contests
    .filter(isContestActive(getCurrentTimeInSeconds()))
    .map(convertToStandardContest))
  .catch(parserErrorHandler(PLATFORM));

module.exports = leetcode;
