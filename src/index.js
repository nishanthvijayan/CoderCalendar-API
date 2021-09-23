const AWS = require('aws-sdk');
const axios = require('axios');

const { flat, getCurrentTimeInSeconds } = require('./utils');

const codeforces = require('./parsers/codeforces');
const hackerearth = require('./parsers/hackerearth');
const hackerrank = require('./parsers/hackerrank');
const topcoder = require('./parsers/topcoder');
const leetcode = require('./parsers/leetcode');
const codechef = require('./parsers/codechef');
const atcoder = require('./parsers/atcoder');
const csacademy = require('./parsers/csacademy');
const coj = require('./parsers/coj');
const kaggle = require('./parsers/kaggle');
const interviewbit = require('./parsers/interviewbit');


const s3bucket = new AWS.S3({});


exports.handler = async (event) => {
    return axios.all([
      codeforces(),
      hackerearth(),
      hackerrank(),
      topcoder(),
      leetcode(),
      codechef(),
      atcoder(),
      csacademy(),
      coj(),
      kaggle(),
      interviewbit(),
    ])
      .then((contestsByPlatform) => {
        const contests = flat(contestsByPlatform.filter(it => Array.isArray(it)));

        const curTime = getCurrentTimeInSeconds();

        const sortByStartTime = (a, b) => a.startTime - b.startTime;
        const sortByEndTime = (a, b) => a.endTime - b.endTime;

        const isOngoing = contest => contest.startTime < curTime && contest.endTime > curTime;
        const isUpcoming = contest => contest.startTime > curTime && contest.endTime > curTime;

        const ongoingContests = contests.filter(isOngoing).sort(sortByEndTime);
        const upcomingContests = contests.filter(isUpcoming).sort(sortByStartTime);

        const resultsJson = JSON.stringify({
          results: {
            timestamp: curTime,
            ongoing: ongoingContests,
            upcoming: upcomingContests,
          }
        });

        const params = {
            Bucket: "codercalendar-api",
            Key: "response.json",
            Body: resultsJson,
            ContentType: "application/json;charset=UTF-8",
            ACL: 'public-read'
        };

        return s3bucket.upload(params).promise().then((data) => {
            console.log(`File uploaded successfully at ${data.Location}`)
        });
      });
};


