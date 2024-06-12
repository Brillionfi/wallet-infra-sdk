import winston from 'winston';
import util from 'util';

const customFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    const cleanMeta = Object.fromEntries(
      Object.entries(meta).filter(([key]) => typeof key !== 'symbol'),
    );

    const metaString =
      cleanMeta && Object.keys(cleanMeta).length
        ? util.inspect(cleanMeta, { depth: null, colors: true })
        : '';

    return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaString}`;
  },
);

const logger = winston.createLogger({
  level: process.env['LOG_LEVEL'] || 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat,
    winston.format.colorize({
      all: true,
    }),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
