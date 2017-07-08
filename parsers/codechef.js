var axios = require("axios");
var cheerio = require("cheerio");

var codechef = function(){
    return axios.get("http://www.codechef.com/contests", {timeout: 30000})
                .then(function(response){
                    var $ = cheerio.load(response.data);
                    var statusdiv = $("table .dataTable")
                    var headings = $("h3")
                    var contest_tables = {"Future Contests": [], "Present Contests": []}
                    for (var i = 0; i < headings.length; i++) {
                        if(headings.eq(i).text() != "Past Contests"){
                            contest_tables[headings.eq(i).text()] = statusdiv.eq(i).find("tr").slice(1);
                        }
                    }
                    var contests = contest_tables['Present Contests'].map(function(i, elem){
                        var present_contest = $(elem);
                        var details = present_contest.find("td");
                        var start_time = new Date(details.eq(2).text()).getTime()/1000;
                        var end_time = new Date(details.eq(3).text()).getTime()/1000;
                        return {
                                "name": details.eq(1).text(),
                                "url": "http://www.codechef.com" + details.eq(1).find('a').attr("href"),
                                "platform": 'codechef',
                                "start_time": start_time,
                                "end_time": end_time,
                                "duration": (end_time - start_time),
                            }
                    }).get();

                    contests = contests.concat(contest_tables["Future Contests"].map(function(i, elem){
                        var upcoming_contest = $(elem);
                        var details = upcoming_contest.find("td")
                        var start_time = new Date(details.eq(2).text()).getTime()/1000;
                        var end_time = new Date(details.eq(3).text()).getTime()/1000;
                        return {
                                "name": details.eq(1).text(),
                                "url": "http://www.codechef.com" + details.eq(1).find('a').attr("href"),
                                "platform": 'codechef',
                                "start_time": start_time,
                                "end_time": end_time,
                                "duration": (end_time - start_time),
                            }
                    }).get());

                    return contests;
                })
                .catch(function(error){
                    console.log("Codechef: ", error.toString());
                });
};

module.exports = codechef;
