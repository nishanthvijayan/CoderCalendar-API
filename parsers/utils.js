module.exports = {
  parserErrorHandler: platform => (error) => {
    console.log(platform, error.toString());
  },
};
