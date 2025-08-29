import winston from 'winston';
import path from 'path';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.colorize({ all: true }),
      winston.format.printf(info => {
        if (info.stack) {
          return `${info.timestamp} ${info.level}: ${info.message}\n${info.stack}`;
        }
        if (info.error) { // Check for the 'error' property added by errorHandler
          return `${info.timestamp} ${info.level}: ${info.message} ${JSON.stringify(info.error)}`;
        }
        return `${info.timestamp} ${info.level}: ${info.message}`;
      })
    ),
  }),

  // Error log file
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),

  // Combined log file
  new winston.transports.File({
    filename: path.join('logs', 'combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

export const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});
