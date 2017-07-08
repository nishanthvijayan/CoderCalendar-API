var filter = function(contests, options){
	var filteredContests = contests;
	if(options.platform){
		filteredContests = {
			"ongoing": contests.ongoing.filter((contest) => {
					return contest.platform == options.platform;
				}),
			"upcoming": contests.upcoming.filter((contest) => {
					return contest.platform == options.platform;
				})
		};
	}

	if(options.status == "ongoing"){
		filteredContests = filteredContests.ongoing;
	}else if(options.status == "upcoming"){
		filteredContests = filteredContests.upcoming;
	}

	return filteredContests;
};

module.exports = filter;
