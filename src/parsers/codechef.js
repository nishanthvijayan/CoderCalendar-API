const axios = require('axios');
const cheerio = require('cheerio');

function parseContestDetails(object) {
  const cname = object.contest_name;
  const code = object.contest_code;
  const startTime = object.contest_start_date;
  const endTime = object.contest_end_date;

  return {
    name: cname,
    url: `https://www.codechef.com/${code}?itm_campaign=contest_listing`,
    platform: 'codechef',
    startTime,
    endTime,
  };
}

const codechef = () => axios.get('https://www.codechef.com/api/list/contests/all?sort_by=END&sorting_order=desc&offset=0', { timeout: 30000 })
  .then((response) => {
    const contestTables = { 'Upcoming Coding Contests': [], 'Present Coding Contests': [] };
    response.data.present_contests.forEach(element => {
      contestTables['Present Coding Contests'].push(parseContestDetails(element));
    });
    response.data.future_contests.forEach(element => {
      contestTables['Upcoming Coding Contests'].push(parseContestDetails(element));
    });
    return contestTables;
  })
  .catch((error) => {
    console.log('Codechef: ', error.toString());
  });

module.exports = codechef;
