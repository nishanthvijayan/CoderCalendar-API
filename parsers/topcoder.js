var axios = require("axios");

var topcoder = function(){
    return axios.get("https://clients6.google.com/calendar/v3/calendars/appirio.com_bhga3musitat85mhdrng9035jg@group.calendar.google.com/events?calendarId=appirio.com_bhga3musitat85mhdrng9035jg%40group.calendar.google.com&singleEvents=true&timeZone=Asia%2FCalcutta&maxAttendees=1&maxResults=250&sanitizeHtml=true&timeMin=2016-07-10T00%3A00%3A00-04%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs", {timeout: 15000})
                .then(function(response){
                    contests = response.data.items
                        .map(function(contest){
                            var start_time = new Date(contest.start.dateTime).getTime()/1000;
                            var end_time = new Date(contest.end.dateTime).getTime()/1000;
                            var name = contest.summary;
                            if(name.indexOf("SRM") != -1 && "description" in contest){
                                url = "http://community.topcoder.com/tc?module=MatchDetails&rd="+ contest.description.slice(110,5);
                            }else{
                                url = "http://tco15.topcoder.com/algorithm/rules/";
                            }
                            return {
                                "name": name,
                                "url": contest.url,
                                "platform": 'topcoder',
                                "start_time": start_time,
                                "end_time": end_time,
                                "duration": (end_time - start_time),
                            }
                        });

                    return contests;
                })
                .catch(function(error){
                    console.log("Topcoder: ", error.toString());
                });
};

module.exports = topcoder;
