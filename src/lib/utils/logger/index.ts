import developmentLogger from './development';
import config from '@/lib/config';

const logger =
  ['staging', 'production'].includes(config.NODE_ENV)
    ? // lazy-load to avoid CloudWatch init in dev
      (() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('./cloudwatch').default;
      })()
    : developmentLogger;

export default logger;
