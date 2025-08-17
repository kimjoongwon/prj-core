// Browser utilities
export { navigateTo, reload, getCurrentUrl, getUserAgent } from "./src/BrowserUtil";

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
} from "./src/DateTimeUtil";

// Environment utilities
export {
	getCurrentEnvironment,
	isDevelopment,
	isStaging,
	isProduction,
	getConfigByEnvironment,
} from "./src/EnvironmentUtil";

// Form validation utilities
export { validateSingleField, validateFields } from "./src/FormValidationUtil";
export type { Validation } from "./src/FormValidationUtil";

// Logger utilities
export { createLogger } from "./src/LoggerUtil";
export type { LogData, Logger } from "./src/LoggerUtil";

// Path utilities
export { getUrlWithParamsAndQueryString, convertFromPathParamsToQueryParams } from "./src/PathUtil";

// Tool utilities
export { getProperty, setProperty, deepClone, createRange } from "./src/Tool";

// Validation utilities
export { validateConfig, getVariableName } from "./src/ValidationUtil";

// Types
export type { EnvironmentInfo } from "./src/EnvironmentUtil";
