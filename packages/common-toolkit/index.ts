// Language utilities
export { parseAcceptLanguage } from "./src/Language";

// Browser utilities
export {
	getCurrentUrl,
	getUserAgent,
	navigateTo,
	reload,
} from "./src/Browser";

// Device utilities
export type { DeviceType } from "./src/Device";
export {
	DEVICE_BREAKPOINTS,
	getDeviceType,
	isDesktop,
	isMobile,
	isTablet,
} from "./src/Device";

// DateTime utilities
export {
	add,
	formatDate,
	formatDateTime,
	formatDateTimeWithSeconds,
	formatTime,
	getDate,
	getNow,
	getYear,
	isSame,
	startOf,
	subtract,
	toISOString,
} from "./src/DateTime";
// Types
export type { EnvironmentInfo } from "./src/Environment";
// Environment utilities
export {
	getConfigByEnvironment,
	getCurrentEnvironment,
	isDevelopment,
	isProduction,
	isStaging,
} from "./src/Environment";
export type { Validation } from "./src/Form";
// Form validation utilities
export { validateFields, validateSingleField } from "./src/Form";
export type { LogData, Logger } from "./src/Logger";
// Logger utilities
export { createLogger } from "./src/Logger";
// Path utilities
export {
	convertFromPathParamsToQueryParams,
	getUrlWithParamsAndQueryString,
} from "./src/Path";
// Tool utilities
export {
	createRange,
	deepClone,
	getProperty,
	setProperty,
	tools,
} from "./src/Tool";

// Namespace objects for convenient grouped access
import * as BrowserModule from "./src/Browser";
import * as DateTimeModule from "./src/DateTime";
import * as DeviceModule from "./src/Device";
import * as EnvironmentModule from "./src/Environment";
import * as FormModule from "./src/Form";
import * as LoggerModule from "./src/Logger";
import * as PathModule from "./src/Path";
import * as ToolModule from "./src/Tool";

export const browser = {
	navigateTo: BrowserModule.navigateTo,
	reload: BrowserModule.reload,
	getCurrentUrl: BrowserModule.getCurrentUrl,
	getUserAgent: BrowserModule.getUserAgent,
} as const;

export const device = {
	getDeviceType: DeviceModule.getDeviceType,
	isMobile: DeviceModule.isMobile,
	isTablet: DeviceModule.isTablet,
	isDesktop: DeviceModule.isDesktop,
	BREAKPOINTS: DeviceModule.DEVICE_BREAKPOINTS,
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
	convertFromPathParamsToQueryParams:
		PathModule.convertFromPathParamsToQueryParams,
} as const;

export const tool = {
	getProperty: ToolModule.getProperty,
	setProperty: ToolModule.setProperty,
	deepClone: ToolModule.deepClone,
	createRange: ToolModule.createRange,
} as const;

import * as LanguageModule from "./src/Language";

export const language = {
	parseAcceptLanguage: LanguageModule.parseAcceptLanguage,
} as const;

// es-toolkit utilities re-export for convenient access
export {
	// Additional utilities
	castArray,
	// Object manipulation
	cloneDeep,
	defaultsDeep,
	// Object utilities
	get,
	// Type checking
	isEmpty,
	isNil,
	isString,
	mapValues,
	merge,
	// Array utilities
	range,
	set,
} from "es-toolkit/compat";
