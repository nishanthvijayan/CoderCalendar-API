var axios = require("axios");
var cheerio = require("cheerio");

var calcTimeUTC = function(datetimeString){
  var four_hours_in_s = 4 * 60 * 60;

  var year = datetimeString.slice(0,4);
  var month = datetimeString.slice(5,7) - 1;
  var day = datetimeString.slice(8,10);
  var hour = datetimeString.slice(11,13);
  var minute = datetimeString.slice(14,16);
  
  // Date provided by coj follows Cuba timezone(GMT+04:00)
  var datetime_in_s_utc = new Date(Date.UTC(year, month, day, hour, minute)).getTime()/1000 + four_hours_in_s;
  return datetime_in_s_utc;
};

var coj = function(){
    var config = {
      timeout: 30000
    };
    return axios.get("http://coj.uci.cu/tables/coming.xhtml", config)
                .then(function(response){
                    var $ = cheerio.load(response.data);                    
                    var contests = $('table').eq(1).find('tr').slice(1);

                    return contests.map(function(i, contest){
                        var details = $(this).children('td');
                        var name = details.eq(2).find('a').text();
                        var start_time = calcTimeUTC(details.eq(3).find('a').text().slice(17));
                        var end_time = calcTimeUTC(details.eq(4).find('a').text().slice(17));
                        var url = "http://coj.uci.cu/contest/" + details.eq(2).find('a').attr('href');

                        return {
                          "name": name,
                          "url": url,
                          "platform": "coj",
                          "start_time": start_time,
                          "end_time": end_time,
                          "duration": end_time - start_time
                        };
                    }).get();
                })
                .catch(function(error){
                    console.log("coj: ", error.toString());
                });
};

module.exports = coj;
