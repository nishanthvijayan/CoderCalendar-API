const axios = require('axios');
const cheerio = require('cheerio');

const calcTimeUTC = function (datetimeString) {
  const four_hours_in_s = 4 * 60 * 60;

  const year = datetimeString.slice(0, 4);
  const month = datetimeString.slice(5, 7) - 1;
  const day = datetimeString.slice(8, 10);
  const hour = datetimeString.slice(11, 13);
  const minute = datetimeString.slice(14, 16);

  // Date provided by coj follows Cuba timezone(GMT+04:00)
  const datetime_in_s_utc = new Date(Date.UTC(year, month, day, hour, minute)).getTime() / 1000 + four_hours_in_s;
  return datetime_in_s_utc;
};

function getUpcomingContests() {
  return axios.get('http://coj.uci.cu/tables/coming.xhtml', { timeout: 15000 });
}

function getOngoingContests() {
  return axios.get('http://coj.uci.cu/tables/running.xhtml', { timeout: 15000 });
}

const coj = function () {
  return axios.all([getOngoingContests(), getUpcomingContests()])
    .then((responses) => {
      let contests = [];
      responses.forEach((response) => {
        const $ = cheerio.load(response.data);
        const contest_rows = $('table').eq(1).find('tr').slice(1);

        contests = contests.concat(
          contest_rows.map(function (i, contest) {
            const details = $(this).children('td');
            const name = details.eq(2).find('a').text();
            const start_time = calcTimeUTC(details.eq(3).find('a').text().slice(17));
            const end_time = calcTimeUTC(details.eq(4).find('a').text().slice(17));
            const url = `http://coj.uci.cu/contest/${details.eq(2).find('a').attr('href')}`;

            return {
              name,
              url,
              platform: 'coj',
              start_time,
              end_time,
              duration: end_time - start_time,
            };
          }).get(),
        );
      });

      return contests;
    })
    .catch((error) => {
      console.log('coj: ', error.toString());
    });
};

module.exports = coj;
