var axios = require("axios");

var hackerrank = function(type){
    var cur_time = new Date().getTime();

    return axios.get("https://www.hackerrank.com/rest/contests/" + type +
                    "?offset=0&limit=10&contest_slug=active&_="+cur_time, {timeout: 15000})
                .then(function(response){
                    contests = response.data.models
                        .map(function(contest){
                            var start_time = new Date(contest.get_starttimeiso).getTime()/1000;
                            var end_time = new Date(contest.get_endtimeiso).getTime()/1000;
                            return {
                                "name": contest.name,
                                "url": "https://www.hackerrank.com/" + contest.slug,
                                "platform": 'hackerrank',
                                "start_time": start_time,
                                "end_time": end_time,
                                "duration": (end_time - start_time),
                            }
                        });

                    console.log("Hackerrank (" + type + ") fetched successfully!");
                    return contests;
                })
                .catch(function(error){
                    console.log("Hackerrank (" + type + "): ", error.toString());
                });
};

module.exports = hackerrank;
