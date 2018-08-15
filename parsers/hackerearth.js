const axios = require('axios');

const hackerearth = function () {
  return axios.get('https://www.hackerearth.com/chrome-extension/events/', { timeout: 15000 })
    .then((response) => {
      contests = response.data.response
        .map((contest) => {
          const start_time = new Date(contest.start_utc_tz).getTime() / 1000;
          const end_time = new Date(contest.end_utc_tz).getTime() / 1000;
          return {
            name: contest.title,
            url: contest.url,
            platform: 'hackerearth',
            start_time,
            end_time,
            duration: (end_time - start_time),
          };
        });

      return contests;
    })
    .catch((error) => {
      console.log('Hackerearth: ', error.toString());
    });
};

module.exports = hackerearth;
