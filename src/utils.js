const parserErrorHandler = platform => error => console.log(platform, error.toString());

const flat = arr => arr.reduce((res, it) => res.concat(Array.isArray(it) ? flat(it) : it), []);

const getCurrentTimeInSeconds = () => new Date().getTime() / 1000;

module.exports = {
  parserErrorHandler,
  flat,
  getCurrentTimeInSeconds,
};
