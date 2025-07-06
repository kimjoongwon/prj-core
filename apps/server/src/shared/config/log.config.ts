import { LogLevel } from '@nestjs/common';

export interface LogConfig {
  level: LogLevel[];
  timestamp: boolean;
  colorize: boolean;
  context: boolean;
  prettyPrint: boolean;
}

export const getLogConfig = (): LogConfig => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const isTest = process.env.NODE_ENV === 'test';

  if (isTest) {
    return {
      level: ['error'],
      timestamp: false,
      colorize: false,
      context: false,
      prettyPrint: false,
    };
  }

  if (isDevelopment) {
    return {
      level: ['debug', 'log', 'warn', 'error'],
      timestamp: true,
      colorize: true,
      context: true,
      prettyPrint: true,
    };
  }

  // Production
  return {
    level: ['log', 'warn', 'error'],
    timestamp: true,
    colorize: false,
    context: false,
    prettyPrint: false,
  };
};

export const logConfig = getLogConfig();
