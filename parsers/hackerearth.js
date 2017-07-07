var axios = require("axios");

var hackerearth = function(){
    return axios.get("https://www.hackerearth.com/chrome-extension/events/", {timeout: 15000})
                .then(function(response){
                    contests = response.data.response
                        .map(function(contest){
                            var start_time = new Date(contest.start_utc_tz).getTime()/1000;
                            var end_time = new Date(contest.end_utc_tz).getTime()/1000;
                            return {
                                "name": contest.title,
                                "url": contest.url,
                                "platform": 'hackerearth',
                                "start_time": start_time,
                                "end_time": end_time,
                                "duration": (end_time - start_time),
                            }
                        });

                    return contests;
                })
                .catch(function(error){
                    console.log("Hackerearth: ", error.toString());
                });
};

module.exports = hackerearth;
