const axios = require('axios');
const parserErrorHandler = require('./utils');

const LEETCODE_API_URL = 'https://leetcode.com/contest/api/list/';
const PLATFORM = 'LEETCODE';

const getCurrentTime = () => new Date().getTime() / 1000;

const isContestActive = curTime => contest => (contest.start_time + contest.duration) > curTime;

const convertToStandardContest = contest => ({
  name: contest.title,
  url: `https://leetcode.com/contest/${contest.title_slug}`,
  platform: 'leetcode',
  start_time: contest.start_time,
  end_time: contest.start_time + contest.duration,
  duration: contest.duration,
});

const leetcode = () => axios.get(LEETCODE_API_URL, { timeout: 15000 })
  .then(response => response.data.contests
    .filter(isContestActive(getCurrentTime()))
    .map(convertToStandardContest))
  .catch(parserErrorHandler(PLATFORM));

module.exports = leetcode;
