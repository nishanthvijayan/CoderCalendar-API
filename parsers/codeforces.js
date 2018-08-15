const axios = require('axios');

const codeforces = function () {
  return axios.get('http://codeforces.com/api/contest.list', { timeout: 15000 })
    .then((response) => {
      contests = response.data.result
        .filter(contest => contest.phase.trim() != 'FINISHED').map(contest => ({
          name: contest.name,
          url: `http://codeforces.com/contest/${contest.id}`,
          platform: 'codeforces',
          start_time: contest.startTimeSeconds,
          end_time: (contest.startTimeSeconds + contest.durationSeconds),
          duration: contest.durationSeconds,
        }));
      return contests;
    })
    .catch((error) => {
      console.log('Codeforces: ', error.toString());
    });
};

module.exports = codeforces;
