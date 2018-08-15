const filter = function (contests, options) {
  let filteredContests = contests;
  if (options.platform) {
    filteredContests = {
      ongoing: contests.ongoing.filter(contest => contest.platform == options.platform),
      upcoming: contests.upcoming.filter(contest => contest.platform == options.platform),
    };
  }

  if (options.status == 'ongoing') {
    filteredContests = filteredContests.ongoing;
  } else if (options.status == 'upcoming') {
    filteredContests = filteredContests.upcoming;
  }

  return filteredContests;
};

module.exports = filter;
