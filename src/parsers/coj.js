const axios = require('axios');
const cheerio = require('cheerio');
const { parserErrorHandler } = require('./../utils');

const PLATFORM = 'COJ';

const calcTimeUTC = (datetimeString) => {
  const fourHoursInSeconds = 4 * 60 * 60;

  const year = datetimeString.slice(0, 4);
  const month = datetimeString.slice(5, 7) - 1;
  const day = datetimeString.slice(8, 10);
  const hour = datetimeString.slice(11, 13);
  const minute = datetimeString.slice(14, 16);

  // Date provided by coj follows Cuba timezone(GMT+04:00)
  return new Date(Date.UTC(year, month, day, hour, minute)).getTime() / 1000 + fourHoursInSeconds;
};

function getUpcomingContests() {
  return axios.get('http://coj.uci.cu/tables/coming.xhtml', { timeout: 15000 });
}

function getOngoingContests() {
  return axios.get('http://coj.uci.cu/tables/running.xhtml', { timeout: 15000 });
}

const coj = () => axios.all([getOngoingContests(), getUpcomingContests()])
  .then((responses) => {
    let contests = [];
    responses.forEach((response) => {
      const $ = cheerio.load(response.data);
      const contestRows = $('table').eq(1).find('tr').slice(2);

      contests = contests.concat(
        contestRows.map((_, contest) => {
          const details = $(contest).children('td');
          const name = details.eq(2).find('a').text();
          const startTime = calcTimeUTC(details.eq(3).find('a').text().slice(17));
          const endTime = calcTimeUTC(details.eq(4).find('a').text().slice(17));
          const url = `http://coj.uci.cu/contest/${details.eq(2).find('a').attr('href')}`;

          return {
            name,
            url,
            platform: 'coj',
            startTime,
            endTime,
          };
        }).get(),
      );
    });

    return contests;
  })
  .catch(parserErrorHandler(PLATFORM));

module.exports = coj;
