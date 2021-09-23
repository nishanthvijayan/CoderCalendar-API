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
        startTime = $(parentElem).text().trim().slice(0, 11);
        upcomingContestsStartTime.push(startTime);
      })
      var upcomingContestEndTimeAndDuration = []
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
        var upcominContestDurationElementSelector = '#hackathon-details-div > div:nth-child(3) > span.details-wrapper > span.info-value';
        var endTime = $(upcominContestEndTimeElementSelector).first().text().trim().slice(0, 11);
        var duration = $(upcominContestDurationElementSelector).first().text().trim();
        var endTimeAndDurationDetails = [endTime, duration];
        upcomingContestEndTimeAndDuration.push(endTimeAndDurationDetails)
      }
      upcomingList = []
      for (let i = 0; i < upcomingContestsLink.length; i++) {
          addDict = {};
          addDict["Name"] = upcomingContestsLink[i][1]
          addDict["Platform"] = "Interview Bit"
          addDict["challenge_type"] = "Contest"
          addDict["url"] = upcomingContestsLink[i][0]
          addDict["start_time"] = upcomingContestsStartTime[i]
          addDict["end_time"] = upcomingContestEndTimeAndDuration[i][0]
          addDict["duration"] = upcomingContestEndTimeAndDuration[i][1]
          upcomingList.push(addDict)
      }
      var activeContestLinkElementSelector = '#active_contests > div > div > div > div > div.col-xs-12.col-sm-8.col-md-8.card-detail > div > div > a';
      var activeContestsLink = [];
      $(activeContestLinkElementSelector).each((parentIdx, parentElem) => {
          var actualLink = "https://www.interviewbit.com".concat($(parentElem).attr('href'));
          var name = $(parentElem).text().trim();
          nameAndLink = [actualLink, name];
          activeContestsLink.push(nameAndLink);
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
          addDict["Name"] = activeContestsLink[i][1]
          addDict["Platform"] = "Interview Bit"
          addDict["challenge_type"] = "Contest"
          addDict["url"] = activeContestsLink[i][0]
          addDict["end_time"] = activeContestsEndTime[i]
          activeList.push(addDict)
      }
      finalContestList = upcomingList.concat(activeList);
      return finalContestList
    })
    .catch(parserErrorHandler(PLATFORM));
};

module.exports = interviewbit;
