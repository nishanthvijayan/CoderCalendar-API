var axios = require("axios");

var contest_url = function(name){
    if(name.indexOf("AtCoder Grand Contest") != -1){
        return "http://agc" + name.slice(-3) + ".contest.atcoder.jp/";
    }else if(name.indexOf("AtCoder Regular Contest") != -1){
        return "http://arc" + name.slice(-3) + ".contest.atcoder.jp/";
    }else if(name.indexOf("AtCoder Beginner Contest") != -1){
        return "http://abc" + name.slice(-3) + ".contest.atcoder.jp/";
    }
    return "https://atcoder.jp/contest";
}

var atcoder = function(){
    return axios.get("https://clients6.google.com/calendar/v3/calendars/atcoder.jp_evjr135c62bddnpd26lotmdicg@group.calendar.google.com/events?calendarId=atcoder.jp_evjr135c62bddnpd26lotmdicg%40group.calendar.google.com&timeMin=2017-06-25T00%3A00%3A00%2B09%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs", {timeout: 15000})
                .then(function(response){
                    contests = response.data.items
                        .map(function(contest){
                            var start_time = new Date(contest.start.dateTime).getTime()/1000;
                            var end_time = new Date(contest.end.dateTime).getTime()/1000;
                            var name = contest.summary;
                            return {
                                "name": name,
                                "url": contest_url(name),
                                "platform": 'atcoder',
                                "start_time": start_time,
                                // the calendar does not provide endtime nor duration
                                // so assume duration 2hrs as they tend to be in Atcoder
                                "end_time": start_time + (2 * 60* 60),
                                "duration": (2 * 60* 60),
                            }
                        });

                    return contests;
                })
                .catch(function(error){
                    console.log("Atcoder: ", error.toString());
                });
};

module.exports = atcoder;
