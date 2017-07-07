var axios = require("axios");

var leetcode = function(){
    return axios.get("https://leetcode.com/contest/api/list/", {timeout: 15000})
                .then(function(response){
                    var cur_time = new Date().getTime()/1000;

                    return response.data.contests
                        .filter(function(contest){
                            return ((contest.start_time + contest.duration) > cur_time);
                        })
                        .map(function(contest){
                            return {
                                "name": contest.title,
                                "url": "https://leetcode.com/contest/" + contest.title_slug,
                                "platform": 'leetcode',
                                "start_time": contest.start_time,
                                "end_time": contest.start_time + contest.duration,
                                "duration": contest.duration,
                            };
                        });
                })
                .catch(function(error){
                    console.log("Leetcode: ", error.toString());
                });
};

module.exports = leetcode;
