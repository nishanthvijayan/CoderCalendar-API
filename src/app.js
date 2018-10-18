const { CronJob } = require('cron');

const server = require('./server');
const runner = require('./runner');

// Set up job that'll run runner every 10 minutes
new CronJob('*/10 * * * *', runner).start();

// Run runner once now
runner();

// Start the server
const port = process.env.PORT ? process.env.PORT : 8000;
server.listen(port, () => console.log(`Listening in port ${port}`));
