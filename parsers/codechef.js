var axios = require("axios");
var cheerio = require("cheerio");

var codechef = function(){
    return axios.get("http://www.codechef.com/contests", {timeout: 15000})
                .then(function(response){
                    var $ = cheerio.load(response.data);
                    var statusdiv = $("table .dataTable")
                    var headings = $("h3")
                    var contest_tables = {"Future Contests": [], "Present Contests": []}
                    for (var i = 0; i < headings.length; i++) {
                        headings[i]
                    }
                    for i in xrange(len(headings)):
                        if headings[i].text != "Past Contests":
                            contest_tables[headings[i].text] = statusdiv[i].findAll("tr")[1:]

                    for upcoming_contest in contest_tables["Future Contests"]:
                        details = upcoming_contest.findAll("td")
                        start_time = strptime(details[2].text, "%d %b %Y %H:%M:%S")
                        end_time = strptime(details[3].text, "%d %b %Y %H:%M:%S")
                        duration = get_duration(int((mktime(end_time) - mktime(start_time)) / 60))
                        posts["upcoming"].append({"Name":  details[1].text,
                                                  "url": "http://www.codechef.com" + details[1].a["href"],
                                                  "StartTime": strftime("%a, %d %b %Y %H:%M", start_time),
                                                  "EndTime": strftime("%a, %d %b %Y %H:%M", end_time),
                                                  "Duration": duration,
                                                  "Platform": "CODECHEF"})

                    for present_contest in contest_tables["Present Contests"]:
                        details = present_contest.findAll("td")
                        end_time = strptime(details[3].text, "%d %b %Y %H:%M:%S")
                        posts["ongoing"].append({"Name":  details[1].text,
                                                 "url": "http://www.codechef.com" + details[1].a["href"],
                                                 "EndTime": strftime("%a, %d %b %Y %H:%M", end_time),
                                                 "Platform": "CODECHEF"})


                    // contests = response.data.body
                    //     .map(function(contest){
                    //         var start_time = new Date(contest.start_utc_tz).getTime()/1000;
                    //         var end_time = new Date(contest.end_utc_tz).getTime()/1000;
                    //         return {
                    //             "name": contest.title,
                    //             "url": contest.url,
                    //             "platform": 'codechef',
                    //             "start_time": start_time,
                    //             "end_time": end_time,
                    //             "duration": (end_time - start_time),
                    //         }
                    //     });

                    // console.log("Codechef fetched successfully!");
                    // return contests;
                    return [];
                })
                .catch(function(error){
                    console.log("Codechef: ", error.toString());
                });
};

module.exports = codechef;
