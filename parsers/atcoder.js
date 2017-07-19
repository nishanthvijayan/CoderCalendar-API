var axios = require("axios");
var cheerio = require("cheerio");

var parseDuration = function(duration_string){
  var duration_parts = duration_string.split(":");
  var hours = Number(duration_parts[0]);
  var minutes = Number(duration_parts[1]);
  return (hours*60 + minutes)*60;
};

var calcStartTimeUTC = function(datetimeString){
  var nine_hours_in_s = 9 * 60 * 60;

  var year = datetimeString.slice(0,4);
  var month = datetimeString.slice(5,7) - 1;
  var day = datetimeString.slice(8,10);
  var hour = datetimeString.slice(11,13);
  var minute = datetimeString.slice(14,16);
  
  // Date provided by atcoder follows Tokyo timezone(GMT+09:00)
  var datetime_in_s_utc = new Date(Date.UTC(year, month, day, hour, minute)).getTime()/1000 - nine_hours_in_s;
  return datetime_in_s_utc;
};

var atcoder = function(){
    var config = {
      timeout: 30000,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,im'
      }
    };
    return axios.get("https://atcoder.jp/contest", config)
                .then(function(response){
                    var $ = cheerio.load(response.data);
                    var contests = $('.table-bordered > tbody > tr').slice(1);

                    return contests.map(function(i, contest){
                        var details = $(this).children('td');
                        var name = details.eq(1).find('a').text();
                        var start_time = calcStartTimeUTC(details.eq(0).find('a').text());
                        var duration = parseDuration(details.eq(2).text());
                        var url = details.eq(1).find('a').attr('href');

                        return {
                          "name": name,
                          "url": url,
                          "platform": "atcoder",
                          "start_time": start_time,
                          "end_time": start_time + duration,
                          "duration": duration
                        };
                    }).get();
                })
                .catch(function(error){
                    console.log("Atcoder: ", error.toString());
                });
};

module.exports = atcoder;
