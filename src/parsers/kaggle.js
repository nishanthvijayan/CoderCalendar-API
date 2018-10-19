const axios = require("axios");
const { kaggleUsername, kaggleApiKey } = require("../../secrets.json");
const { parserErrorHandler, getCurrentTimeInSeconds } = require('./../utils');

const KAGGLE_API_URL = "https://www.kaggle.com/api/v1/competitions/list";
const KAGGLE = 'kaggle';

const isContestActive = (currentTimeInSeconds) => contest => contest.endTime > currentTimeInSeconds 

const convertToStandardContest = contest => ({
  name: contest.title,
  url: contest.url,
  platform: KAGGLE,
  startTime: Date.parse(contest.enabledDate) / 1000,
  endTime: Date.parse(contest.deadline) / 1000,
});

const kaggle = () => axios.get(KAGGLE_API_URL, {
    timeout: 15000,
    auth: {
      username: kaggleUsername,
      password: kaggleApiKey,
    },
  })
  .then(response => response.data
    .map(convertToStandardContest)
    .filter(isContestActive(getCurrentTimeInSeconds()))
  )
  .catch(parserErrorHandler(KAGGLE));

module.exports = kaggle;