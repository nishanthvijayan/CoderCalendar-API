const axios = require('axios');
const parserErrorHandler = require('./utils');

const PLATFORM = 'HACKEREARTH';

const hackerearth = () => {
  const getStartTime = contest => new Date(contest.start_utc_tz).getTime() / 1000;
  const getEndTime = contest => new Date(contest.end_utc_tz).getTime() / 1000;

  return axios.get('https://www.hackerearth.com/chrome-extension/events/', { timeout: 15000 })
    .then(response => response.data.response
      .map(contest => ({
        name: contest.title,
        url: contest.url,
        platform: 'hackerearth',
        start_time: getStartTime(contest),
        end_time: getEndTime(contest),
        duration: (getEndTime(contest) - getStartTime(contest)),
      })))
    .catch(parserErrorHandler(PLATFORM));
};

module.exports = hackerearth;
