const axios = require('axios');
const cheerio = require('cheerio');
const { parserErrorHandler } = require('./../utils');

const PLATFORM = 'INTERVIEW BIT';


const interviewbit = () => {
  const config = {
    timeout: 30000,
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,im',
    },
  };
  return axios.get('https://www.interviewbit.com/contests/', config)
    .then(async (response) => {
      var $ = cheerio.load(response.data);
      var upcomingContestLinkElementSelector = '#upcoming_contests > div > div > div > div > div.col-xs-12.col-sm-8.col-md-8.card-detail > div > div > a';
      var upcomingContestsLink = [];
      $(upcomingContestLinkElementSelector).each((parentIdx, parentElem) => {
          var actualLink = "https://www.interviewbit.com".concat($(parentElem).attr('href'));
          var name = $(parentElem).text().trim();
          nameAndLink = [actualLink, name];
          upcomingContestsLink.push(nameAndLink);
      })
      var upcomingContestStartTimeElementSelector = '#upcoming_contests > div > div > div > div > div.col-xs-12.col-sm-8.col-md-8.card-detail > div > div > div > div.info-value';
      var upcomingContestsStartTime = [];
      $(upcomingContestStartTimeElementSelector).each((parentIdx, parentElem) => {
        startTime = $(parentElem).text().trim().slice(0, -4);
        upcomingContestsStartTime.push(startTime);
      })
      var upcomingContestEndTime = []
      for (let i = 0; i < upcomingContestsLink.length; i++) {
        var url = upcomingContestsLink[i][0]
        var config = {
            timeout: 30000,
            headers: {
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,im',
            },
        };
        
        var response = await axios.get(url, config);
        var $ = cheerio.load(response.data);
        var upcominContestEndTimeElementSelector = '#hackathon-details-div > div:nth-child(2) > span.details-wrapper > span.info-value';
        var endTime = $(upcominContestEndTimeElementSelector).first().text().trim().slice(0, -4);
        upcomingContestEndTime.push(endTime)
      }

      const calcTimeUTC = (datetimeString) => {
        var fiveThirtyInSeconds = (5*60 + 30)*60
        function checkNull(val) {
          if (val != null){
            return val
          };
        }
        var datetimeList = datetimeString.split(" ").filter(checkNull);
        var year = datetimeList[2];
        var day = datetimeList[0];
        var hour = datetimeList[3].split(":")[0];
        if (datetimeList[4] == "PM"){
          hour = parseInt(hour) + 12
          hour = hour.toString()
        }; 
        var minute = datetimeList[3].split(":")[1];
        var parseMonth = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12};
        var month = parseMonth[datetimeList[1]].toString();
      
        // Date provided by atcoder follows Tokyo timezone(GMT+09:00)
        return new Date(Date.UTC(year, month, day, hour, minute)).getTime() / 1000 - fiveThirtyInSeconds;
      };

      upcomingList = []
      for (let i = 0; i < upcomingContestsLink.length; i++) {
          addDict = {};
          addDict["name"] = upcomingContestsLink[i][1];
          addDict["platform"] = "Interview Bit";
          addDict["url"] = upcomingContestsLink[i][0];
          addDict["startTime"] = calcTimeUTC(upcomingContestsStartTime[i]);
          addDict["endTime"] = calcTimeUTC(upcomingContestEndTime[i]);
          upcomingList.push(addDict);
      }
      var activeContestLinkElementSelector = '#active_contests > div > div > div > div > div.col-xs-12.col-sm-8.col-md-8.card-detail > div > div > a';
      var activeContestsLink = [];
      $(activeContestLinkElementSelector).each((parentIdx, parentElem) => {
          var actualLink = "https://www.interviewbit.com".concat($(parentElem).attr('href'));
          var name = $(parentElem).text().trim();
          nameAndLink = [actualLink, name];
          activeContestsLink.push(nameAndLink);
      })
      var activeContestStartTimeElementSelector = '#active_contests > div > div > div > div > div.col-xs-12.col-sm-8.col-md-8.card-detail > div > div > div > div.info-value';
      var activeContestsStartTime = [];
      $(activeContestStartTimeElementSelector).each((parentIdx, parentElem) => {
        startTime = $(parentElem).text().trim().slice(0, 11);
        activeContestsStartTime.push(startTime);
      })
      var activeContestEndTimeElementSelector = '#active_contests > div > div > div > div > div.col-xs-12.col-sm-8.col-md-8.card-detail > div > div > div > div.info-value';
      var activeContestsEndTime = [];
      $(activeContestEndTimeElementSelector).each((parentIdx, parentElem) => {
        EndTime = $(parentElem).text().trim().slice(0, 11);
        activeContestsEndTime.push(EndTime);
      })
      activeList = []
      for (let i = 0; i < activeContestsLink.length; i++) {
          addDict = {};
          addDict["name"] = activeContestsLink[i][1];
          addDict["platform"] = "Interview Bit";
          addDict["url"] = activeContestsLink[i][0];
          addDict["startTime"] = calcTimeUTC(activeContestsStartTime[i]);
          addDict["endTime"] = calcTimeUTC(activeContestsEndTime[i]);
          activeList.push(addDict);
      }
      finalContestList = upcomingList.concat(activeList);
      return finalContestList
    })
    .catch(parserErrorHandler(PLATFORM));
};

module.exports = interviewbit;
