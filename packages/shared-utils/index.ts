// Browser utilities
export {
  navigateTo,
  reload,
  getCurrentUrl,
  getUserAgent,
} from "./src/Browser";

// DateTime utilities
export {
  getNow,
  formatDate,
  formatDateTime,
  formatDateTimeWithSeconds,
  startOf,
  subtract,
  add,
  isSame,
  getDate,
  getYear,
  formatTime,
  parseAbsoluteToLocal,
  toISOString,
} from "./src/DateTime";

// Environment utilities
export {
  getCurrentEnvironment,
  isDevelopment,
  isStaging,
  isProduction,
  getConfigByEnvironment,
} from "./src/Environment";

// Form validation utilities
export { validateSingleField, validateFields } from "./src/Form";
export type { Validation } from "./src/Form";

// Logger utilities
export { createLogger } from "./src/Logger";
export type { LogData, Logger } from "./src/Logger";

// Path utilities
export {
  getUrlWithParamsAndQueryString,
  convertFromPathParamsToQueryParams,
} from "./src/Path";

// Tool utilities
export {
  getProperty,
  setProperty,
  deepClone,
  createRange,
  tools,
} from "./src/Tool";

// Validation utilities
export { validateConfig, getVariableName } from "./src/Validation";

// Types
export type { EnvironmentInfo } from "./src/Environment";

// Namespace objects for convenient grouped access
import * as BrowserModule from "./src/Browser";
import * as DateTimeModule from "./src/DateTime";
import * as EnvironmentModule from "./src/Environment";
import * as FormModule from "./src/Form";
import * as LoggerModule from "./src/Logger";
import * as PathModule from "./src/Path";
import * as ToolModule from "./src/Tool";
import * as ValidationModule from "./src/Validation";

export const browser = {
  navigateTo: BrowserModule.navigateTo,
  reload: BrowserModule.reload,
  getCurrentUrl: BrowserModule.getCurrentUrl,
  getUserAgent: BrowserModule.getUserAgent,
} as const;

export const dateTime = {
  getNow: DateTimeModule.getNow,
  formatDate: DateTimeModule.formatDate,
  formatDateTime: DateTimeModule.formatDateTime,
  formatDateTimeWithSeconds: DateTimeModule.formatDateTimeWithSeconds,
  startOf: DateTimeModule.startOf,
  subtract: DateTimeModule.subtract,
  add: DateTimeModule.add,
  isSame: DateTimeModule.isSame,
  getDate: DateTimeModule.getDate,
  getYear: DateTimeModule.getYear,
  formatTime: DateTimeModule.formatTime,
  parseAbsoluteToLocal: DateTimeModule.parseAbsoluteToLocal,
  toISOString: DateTimeModule.toISOString,
} as const;

export const environment = {
  getCurrentEnvironment: EnvironmentModule.getCurrentEnvironment,
  isDevelopment: EnvironmentModule.isDevelopment,
  isStaging: EnvironmentModule.isStaging,
  isProduction: EnvironmentModule.isProduction,
  getConfigByEnvironment: EnvironmentModule.getConfigByEnvironment,
} as const;

export const form = {
  validateSingleField: FormModule.validateSingleField,
  validateFields: FormModule.validateFields,
} as const;

export const logger = {
  create: LoggerModule.createLogger,
} as const;

export const path = {
  getUrlWithParamsAndQueryString: PathModule.getUrlWithParamsAndQueryString,
  convertFromPathParamsToQueryParams: PathModule.convertFromPathParamsToQueryParams,
} as const;

export const tool = {
  getProperty: ToolModule.getProperty,
  setProperty: ToolModule.setProperty,
  deepClone: ToolModule.deepClone,
  createRange: ToolModule.createRange,
  tools: ToolModule.tools,
} as const;

export const validation = {
  validateConfig: ValidationModule.validateConfig,
  getVariableName: ValidationModule.getVariableName,
} as const;
