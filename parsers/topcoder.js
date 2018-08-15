const axios = require('axios');

const topcoder = function () {
  return axios.get('https://clients6.google.com/calendar/v3/calendars/appirio.com_bhga3musitat85mhdrng9035jg@group.calendar.google.com/events?calendarId=appirio.com_bhga3musitat85mhdrng9035jg%40group.calendar.google.com&timeMin=2017-07-10T00%3A00%3A00-04%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs',
    { timeout: 15000 })
    .then((response) => {
      contests = response.data.items
        .map((contest) => {
          const start_time = new Date(contest.start.dateTime).getTime() / 1000;
          const end_time = new Date(contest.end.dateTime).getTime() / 1000;
          return {
            name: contest.summary,
            url: 'http://topcoder.com',
            platform: 'topcoder',
            start_time,
            end_time,
            duration: (end_time - start_time),
          };
        });

      return contests;
    })
    .catch((error) => {
      console.log('Topcoder: ', error.toString());
    });
};

module.exports = topcoder;
