// TITLE: entry point for the app
// STATUS: COMPLETE

const http = require('http');
const app = require('./app'); // contains app logic
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
