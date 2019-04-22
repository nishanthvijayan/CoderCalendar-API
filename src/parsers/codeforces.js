const axios = require('axios');
const { parserErrorHandler } = require('./../utils');

const PLATFORM = 'codeforces';
const CODEFORCES_API_URL = 'http://codeforces.com/api/contest.list';

const isContestActive = contest => contest.phase.trim() !== 'FINISHED';

const convertToStandardContest = contest => ({
  name: contest.name,
  url: `http://codeforces.com/contests/${contest.id}`,
  platform: PLATFORM,
  startTime: contest.startTimeSeconds,
  endTime: (contest.startTimeSeconds + contest.durationSeconds),
});

const codeforces = () => axios.get(CODEFORCES_API_URL, { timeout: 15000 })
  .then(response => response.data.result.filter(isContestActive).map(convertToStandardContest))
  .catch(parserErrorHandler(PLATFORM));

module.exports = codeforces;
