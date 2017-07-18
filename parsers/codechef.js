var axios = require("axios");
var cheerio = require("cheerio");

function parseContestDetails($, contest_row){
    var details = $(contest_row).find("td");
    var start_time = new Date(details.eq(2).text()).getTime()/1000;
    var end_time = new Date(details.eq(3).text()).getTime()/1000;
    return {
            "name": details.eq(1).text(),
            "url": "http://www.codechef.com" + details.eq(1).find('a').attr("href"),
            "platform": 'codechef',
            "start_time": start_time,
            "end_time": end_time,
            "duration": (end_time - start_time),
        };
}

var codechef = function(){
    return axios.get("http://www.codechef.com/contests", {timeout: 30000})
                .then(function(response){
                    var $ = cheerio.load(response.data);
                    var statusdiv = $("table .dataTable");
                    var headings = $("h3");
                    var contest_tables = {"Future Contests": [], "Present Contests": []};
                    for (var i = 0; i < headings.length; i++) {
                        if(headings.eq(i).text() != "Past Contests"){
                            contest_tables[headings.eq(i).text()] = statusdiv.eq(i).find("tr").slice(1);
                        }
                    }
                    var contests = contest_tables['Present Contests'].map((i, elem)=>{
                        return parseContestDetails($, elem);
                    }).get();

                    contests = contests.concat(contest_tables["Future Contests"].map((i, elem)=>{
                        return parseContestDetails($, elem);
                    }).get());

                    return contests;
                })
                .catch(function(error){
                    console.log("Codechef: ", error.toString());
                });
};

module.exports = codechef;
