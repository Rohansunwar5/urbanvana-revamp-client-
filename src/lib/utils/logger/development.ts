import winston, { format } from 'winston';

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp: ts }) => {
  return `${level} ${ts} : ${message}`;
});

const developmentLogger = winston.createLogger({
  level: 'debug',
  format: combine(format.colorize(), timestamp({ format: 'HH:mm:ss' }), myFormat),
  transports: [new winston.transports.Console()],
});

export default developmentLogger;
