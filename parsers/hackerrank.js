const axios = require('axios');

function getGeneralContests() {
  return axios.get('https://www.hackerrank.com/rest/contests/upcoming?limit=20', { timeout: 15000 });
}

function getCollegeContests() {
  return axios.get('https://www.hackerrank.com/rest/contests/college?limit=20', { timeout: 15000 });
}

const hackerrank = function () {
  return axios.all([getGeneralContests(), getCollegeContests()])
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
};

module.exports = hackerrank;
