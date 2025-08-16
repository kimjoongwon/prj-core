import { BrowserUtil } from "./src/BrowserUtil";
import { DateTimeUtil } from "./src/DateTimeUtil";
import { EnvironmentUtil } from "./src/EnvironmentUtil";
import { FormValidationUtil } from "./src/FormValidationUtil";
import { Tool } from "./src/Tool";
import { LoggerUtil } from "./src/LoggerUtil";
import { PathUtil } from "./src/PathUtil";
import { ValidationUtil } from "./src/ValidationUtil";

const Util = {
	DateTimeUtil,
	PathUtil,
	ValidationUtil,
	FormValidationUtil,
	BrowserUtil,
	EnvironmentUtil,
	LoggerUtil,
	Tool,
};

export {
	DateTimeUtil,
	PathUtil,
	ValidationUtil,
	FormValidationUtil,
	BrowserUtil,
	EnvironmentUtil,
	LoggerUtil,
	Tool,
};
export type { EnvironmentInfo } from "./src/EnvironmentUtil";
export type { LogData } from "./src/LoggerUtil";
export default Util;
