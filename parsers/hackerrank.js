var axios = require("axios");

function getGeneralContests() {
  return axios.get('https://www.hackerrank.com/rest/contests/upcoming?limit=20', {timeout: 15000});
}

function getCollegeContests() {
  return axios.get('https://www.hackerrank.com/rest/contests/college?limit=20', {timeout: 15000});
}

var hackerrank = function(){
    return axios.all([getGeneralContests(), getCollegeContests()])
                .then(function(response){
                    var contests = (response[0].data.models).concat(response[1].data.models);
                    return contests.map(function(contest){
                        var start_time = new Date(contest.get_starttimeiso).getTime()/1000;
                        var end_time = new Date(contest.get_endtimeiso).getTime()/1000;
                        return {
                            "name": contest.name,
                            "url": "https://www.hackerrank.com/" + contest.slug,
                            "platform": 'hackerrank',
                            "start_time": start_time,
                            "end_time": end_time,
                            "duration": (end_time - start_time),
                        };
                    });
                })
                .catch(function(error){
                    console.log("Hackerrank: ", error.toString());
                });
};

module.exports = hackerrank;
