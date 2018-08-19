const axios = require('axios');
const parserErrorHandler = require('./utils');

const PLATFORM = 'CSAcademy';

const csacademy = () => {
  const options = {
    headers: {
      'x-requested-with': 'XMLHttpRequest',
    },
    timeout: 15000,
  };
  return axios.get('https://csacademy.com/contests', options)
    .then(response => response.data.state.contest
      .filter(contest => contest.startTime != null).map(contest => ({
        name: contest.longName,
        url: `https://csacademy.com/contest/${contest.name}`,
        platform: 'csacademy',
        start_time: contest.startTime,
        end_time: contest.endTime,
        duration: (contest.endTime - contest.startTime),
      })))
    .catch(parserErrorHandler(PLATFORM));
};

module.exports = csacademy;
