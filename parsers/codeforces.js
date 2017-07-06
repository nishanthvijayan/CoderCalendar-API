var axios = require("axios");

var codeforces = function(){
    return axios.get("http://codeforces.com/api/contest.list", {timeout: 15000})
                .then(function(response){
                    contests = response.data.result
                        .filter(function(contest){
                            return contest.phase.trim() != 'FINISHED'
                        }).map(function(contest){
                            return {
                                "name": contest.name,
                                "url": "http://codeforces.com/contest/"+ contest.id,
                                "platform": 'codeforces',
                                "start_time": contest.startTimeSeconds,
                                "end_time": (contest.startTimeSeconds + contest.durationSeconds),
                                "duration": contest.durationSeconds,
                            }
                        });
                    console.log("Codeforces fetched successfully!");
                    return contests;
                })
                .catch(function(error){
                    console.log("Codeforces: ", error.toString());
                });
};

module.exports = codeforces;
