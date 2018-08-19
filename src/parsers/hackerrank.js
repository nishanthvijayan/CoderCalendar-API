const axios = require('axios');

const HACKERRANK_GENERAL_CONTESTS_API = 'https://www.hackerrank.com/rest/contests/upcoming?limit=20';
const HACKERRANK_COLLEGE_CONTESTS_API = 'https://www.hackerrank.com/rest/contests/college?limit=20';

const hackerrank = () => axios.all([
  axios.get(HACKERRANK_GENERAL_CONTESTS_API, { timeout: 15000 }),
  axios.get(HACKERRANK_COLLEGE_CONTESTS_API, { timeout: 15000 }),
])
  .then((response) => {
    const contests = (response[0].data.models).concat(response[1].data.models);
    return contests.map((contest) => {
      const startTime = new Date(contest.get_starttimeiso).getTime() / 1000;
      const endTime = new Date(contest.get_endtimeiso).getTime() / 1000;
      return {
        name: contest.name,
        url: `https://www.hackerrank.com/${contest.slug}`,
        platform: 'hackerrank',
        startTime,
        endTime,
      };
    });
  })
  .catch((error) => {
    console.log('Hackerrank: ', error.toString());
  });

module.exports = hackerrank;
