var filter = function(contests, options){
	if(options.platform){
		contests.ongoing = contests.ongoing.filter(function(contest){
			return contest.platform == options.platform;
		});
		contests.upcoming = contests.upcoming.filter(function(contest){
			return contest.platform == options.platform;
		});
	}

	if(options.status == "ongoing"){
		contests = contests.ongoing;
	}else if(options.status == "upcoming"){
		contests = contests.upcoming;
	}

	return contests;
};

module.exports = filter;
