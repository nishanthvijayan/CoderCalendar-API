const axios = require('axios');
const { parserErrorHandler } = require('./../utils');

const PLATFORM = 'codingninjas';
const CODINGNINJAS_API_URL = 'https://codingninjas.in/api/v3/events';
const CODINGNINJAS_URL = 'https://www.codingninjas.in/';

const codingninjas = () => axios.get(CODINGNINJAS_API_URL, { timeout: 15000 })
  .then((response) => {
    const contests = response.data.data.latest_events;
    return contests.map((contest) => {
      const startTime = new Date(contest.event_start_time).getTime();
      const endTime = new Date(contest.event_end_time).getTime();
      return {
        name: contest.name,
        url: CODINGNINJAS_URL,
        platform: PLATFORM,
        startTime,
        endTime,
      };
    });
  })
  .catch(parserErrorHandler(PLATFORM));

module.exports = codingninjas;
