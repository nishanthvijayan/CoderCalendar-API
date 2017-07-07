var axios = require("axios");
var codeforces = require("./parsers/codeforces");
var hackerearth = require("./parsers/hackerearth");
var hackerrank = require("./parsers/hackerrank");
var topcoder = require("./parsers/topcoder");
// var codechef = require("./parsers/codechef");

var aggregate = function(){
	return axios.all([codeforces(), hackerearth(), hackerrank('college'), hackerrank('upcoming'), topcoder()])
		.then(function(contests_by_platform){
			var contests = [].concat.apply([], contests_by_platform);
	        
	        // remove contests that are over
	        var contests = contests.filter(function(contest){
    	    	return (contest.end_time > new Date().getTime()/1000);
        	});

	        var ongoing_contests = contests.filter(function(contest){
    	    	return (contest.start_time < new Date().getTime()/1000);
        	});

	        var upcoming_contests = contests.filter(function(contest){
	        	return (contest.start_time > new Date().getTime()/1000);
	        });

	        return {
	        	"ongoing": ongoing_contests,
	        	"upcoming": upcoming_contests
	        }
		});
};

module.exports = aggregate;
