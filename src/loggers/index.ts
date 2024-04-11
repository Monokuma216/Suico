import pino from 'pino';

const logger = pino({
  level: process.env.REACT_APP_PINO_LOG_LEVEL ?? 'info',
  browser: {
    serialize: true, asObject: true,
  },
});

export default logger;
