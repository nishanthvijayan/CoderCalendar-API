const axios = require('axios');
const { parserErrorHandler } = require('./../utils');

const PLATFORM = 'TOPCODER';
const TOPCODER_API_URL = 'https://clients6.google.com/calendar/v3/calendars/appirio.com_bhga3musitat85mhdrng9035jg@group.calendar.google.com/events?calendarId=appirio.com_bhga3musitat85mhdrng9035jg%40group.calendar.google.com&timeMin=2017-07-10T00%3A00%3A00-04%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs';

const convertToStandardContest = contest => ({
  name: contest.summary,
  url: 'http://topcoder.com',
  platform: 'topcoder',
  startTime: new Date(contest.start.dateTime).getTime() / 1000,
  endTime: new Date(contest.end.dateTime).getTime() / 1000,
});

const hasStartAndEndDateTime =  it => it.start && it.start.dateTime && it.end && it.end.dateTime

const topcoder = () => axios.get(TOPCODER_API_URL, { timeout: 15000 })
  .then(response =>
    response.data.items
    .filter(hasStartAndEndDateTime)
    .map(convertToStandardContest)
  )
  .catch(parserErrorHandler(PLATFORM));

module.exports = topcoder;
