import { WinstonModule, utilities } from 'nest-winston';
import winston from 'winston';

export const loggerConfig = () => ({
  logger: WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: winston.format.combine(
          winston.format.prettyPrint(),
          winston.format.splat(),
          winston.format.timestamp(),
          winston.format.ms(),
          utilities.format.nestLike('로그', {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  }),
});
