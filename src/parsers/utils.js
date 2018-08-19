const parserErrorHandler = platform => error => console.log(platform, error.toString());

module.exports = {
  parserErrorHandler,
};
