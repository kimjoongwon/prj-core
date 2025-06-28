import { DateTimeUtil } from './src/DateTimeUtil';
import { PathUtil } from './src/PathUtil';
import { PaginationUtil } from './src/PaginationUtil';
import { ValidationUtil } from './src/ValidationUtil';
import { FormValidationUtil } from './src/FormValidationUtil';
import { BrowserUtil } from './src/BrowserUtil';
import { EnvironmentUtil } from './src/EnvironmentUtil';
import { LoggerUtil } from './src/LoggerUtil';

const Util = {
  DateTimeUtil,
  PathUtil,
  PaginationUtil,
  ValidationUtil,
  FormValidationUtil,
  BrowserUtil,
  EnvironmentUtil,
  LoggerUtil,
};

export {
  DateTimeUtil,
  PathUtil,
  PaginationUtil,
  ValidationUtil,
  FormValidationUtil,
  BrowserUtil,
  EnvironmentUtil,
  LoggerUtil,
};
export type { EnvironmentInfo } from './src/EnvironmentUtil';
export type { LogData } from './src/LoggerUtil';
export default Util;
