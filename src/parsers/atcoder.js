const axios = require('axios');
const cheerio = require('cheerio');
const { parserErrorHandler } = require('./../utils');

const PLATFORM = 'ATCODER';

const parseDuration = (durationString) => {
  const durationParts = durationString.split(':');
  const hours = Number(durationParts[0]);
  const minutes = Number(durationParts[1]);
  return (hours * 60 + minutes) * 60;
};

const calcStartTimeUTC = (datetimeString) => {
  const nineHoursInSeconds = 9 * 60 * 60;

  const year = datetimeString.slice(0, 4);
  const month = datetimeString.slice(5, 7) - 1;
  const day = datetimeString.slice(8, 10);
  const hour = datetimeString.slice(11, 13);
  const minute = datetimeString.slice(14, 16);

  // Date provided by atcoder follows Tokyo timezone(GMT+09:00)
  return new Date(Date.UTC(year, month, day, hour, minute)).getTime() / 1000 - nineHoursInSeconds;
};

const atcoder = () => {
  const config = {
    timeout: 30000,
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,im',
    },
  };
  return axios.get('https://atcoder.jp/contests', config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const contests = $('.table-bordered > tbody > tr').slice(1);

      return contests.map((_, contest) => {
        const details = $(contest).children('td');
        const name = details.eq(1).find('a').text();
        const startTime = calcStartTimeUTC(details.eq(0).find('a').text());
        const duration = parseDuration(details.eq(2).text());
        const url = "https://atcoder.jp" + details.eq(1).find('a').attr('href');

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
