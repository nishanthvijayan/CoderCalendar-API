const parserErrorHandler = platform => error => console.log(platform, error.toString());

const flat = arr => arr.reduce((res, it) => res.concat(Array.isArray(it) ? flat(it) : it), []);

module.exports = {
  parserErrorHandler,
  flat
};
