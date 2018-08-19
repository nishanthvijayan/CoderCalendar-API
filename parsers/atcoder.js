const axios = require('axios');
const cheerio = require('cheerio');
const parserErrorHandler = require('./utils');

const PLATFORM = 'ATCODER';

const parseDuration = (durationString) => {
  const duration_parts = durationString.split(':');
  const hours = Number(duration_parts[0]);
  const minutes = Number(duration_parts[1]);
  return (hours * 60 + minutes) * 60;
};

const calcStartTimeUTC = function (datetimeString) {
  const nine_hours_in_s = 9 * 60 * 60;

  const year = datetimeString.slice(0, 4);
  const month = datetimeString.slice(5, 7) - 1;
  const day = datetimeString.slice(8, 10);
  const hour = datetimeString.slice(11, 13);
  const minute = datetimeString.slice(14, 16);

  // Date provided by atcoder follows Tokyo timezone(GMT+09:00)
  const datetimeInSecUTC = new Date(Date.UTC(year, month, day, hour, minute)).getTime() / 1000 - nine_hours_in_s;
  return datetimeInSecUTC;
};

const atcoder = function () {
  const config = {
    timeout: 30000,
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,im',
    },
  };
  return axios.get('https://atcoder.jp/contest', config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const contests = $('.table-bordered > tbody > tr').slice(1);

      return contests.map((i, contest) => {
        const details = $(this).children('td');
        const name = details.eq(1).find('a').text();
        const startTime = calcStartTimeUTC(details.eq(0).find('a').text());
        const duration = parseDuration(details.eq(2).text());
        const url = details.eq(1).find('a').attr('href');

        return {
          name,
          url,
          platform: 'atcoder',
          startTime,
          endTime: startTime + duration,
        };
      }).get();
    })
    .catch(parserErrorHandler(PLATFORM));
};

module.exports = atcoder;
