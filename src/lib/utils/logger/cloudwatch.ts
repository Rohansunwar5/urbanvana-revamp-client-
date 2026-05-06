import winston, { format } from 'winston';
import config from '@/lib/config';
import { getDateAsString } from '@/lib/utils/date.util';

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp: ts }) => {
  return `${level} ${ts} : ${message}`;
});

let cloudwatchLogger: winston.Logger;

const buildCloudwatchLogger = () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const CloudWatchTransport = require('winston-cloudwatch');
  return winston.createLogger({
    level: 'info',
    format: combine(timestamp(), myFormat),
    transports: [
      new winston.transports.Console(),
      new CloudWatchTransport({
        logGroupName: config.CLOUDWATCH_LOG_GROUP_NAME,
        logStreamName: getDateAsString(),
        createLogGroup: true,
        createLogStream: true,
        submissionInterval: 2000,
        submissionRetryCount: 1,
        batchSize: 20,
        awsConfig: {
          accessKeyId: config.CLOUDWATCH_LOGS_ID,
          secretAccessKey: config.CLOUDWATCH_LOGS_SECRET,
          region: config.CLOUDWATCH_LOGS_REGION,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatLog: (item: any) =>
          `Date - ${getDateAsString()} ${item.level}: ${item.message} ${JSON.stringify(item.meta)}`,
      }),
    ],
  });
};

try {
  cloudwatchLogger = buildCloudwatchLogger();
} catch {
  cloudwatchLogger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console()],
  });
}

export default cloudwatchLogger;
