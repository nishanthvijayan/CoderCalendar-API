const { CronJob } = require('cron');

const server = require('./server');
const runner = require('./runner');

// Set up job that'll run runner every 10 minutes
new CronJob('*/10 * * * *', runner).start();

// Run runner once now
runner();

// Start the server
server.listen(8000);
