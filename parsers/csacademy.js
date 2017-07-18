var axios = require("axios");

var csacademy = function(){
    var options = {
      headers: {
      'x-requested-with': 'XMLHttpRequest'
      },
      timeout: 15000
    };
    return axios.get("https://csacademy.com/contests", options)
                .then(function(response){
                    contests = response.data.state.contest
                        .filter(function(contest){
                            return contest.startTime != null;
                        }).map(function(contest){
                            return {
                                "name": contest.longName,
                                "url": "https://csacademy.com/contest/"+ contest.name,
                                "platform": 'csacademy',
                                "start_time": contest.startTime,
                                "end_time": contest.endTime,
                                "duration": (contest.endTime - contest.startTime),
                            };
                        });
                    return contests;
                })
                .catch(function(error){
                    console.log("CSAcademy: ", error.toString());
                });
};

module.exports = csacademy;
