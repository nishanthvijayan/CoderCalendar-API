const axios = require('axios');

const leetcode = function () {
  return axios.get('https://leetcode.com/contest/api/list/', { timeout: 15000 })
    .then((response) => {
      const cur_time = new Date().getTime() / 1000;

      return response.data.contests
        .filter(contest => ((contest.start_time + contest.duration) > cur_time))
        .map(contest => ({
          name: contest.title,
          url: `https://leetcode.com/contest/${contest.title_slug}`,
          platform: 'leetcode',
          start_time: contest.start_time,
          end_time: contest.start_time + contest.duration,
          duration: contest.duration,
        }));
    })
    .catch((error) => {
      console.log('Leetcode: ', error.toString());
    });
};

module.exports = leetcode;
