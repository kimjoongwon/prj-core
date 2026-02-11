"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.range = exports.merge = exports.mapValues = exports.isString = exports.isNil = exports.isEmpty = exports.get = exports.defaultsDeep = exports.cloneDeep = exports.castArray = exports.tool = exports.path = exports.logger = exports.form = exports.environment = exports.dateTime = exports.browser = exports.tools = exports.setProperty = exports.getProperty = exports.deepClone = exports.createRange = exports.getUrlWithParamsAndQueryString = exports.convertFromPathParamsToQueryParams = exports.createLogger = exports.validateSingleField = exports.validateFields = exports.isStaging = exports.isProduction = exports.isDevelopment = exports.getCurrentEnvironment = exports.getConfigByEnvironment = exports.toISOString = exports.subtract = exports.startOf = exports.isSame = exports.getYear = exports.getNow = exports.getDate = exports.formatTime = exports.formatDateTimeWithSeconds = exports.formatDateTime = exports.formatDate = exports.add = exports.reload = exports.navigateTo = exports.getUserAgent = exports.getCurrentUrl = void 0;
// Browser utilities
var Browser_1 = require("./src/Browser");
Object.defineProperty(exports, "getCurrentUrl", { enumerable: true, get: function () { return Browser_1.getCurrentUrl; } });
Object.defineProperty(exports, "getUserAgent", { enumerable: true, get: function () { return Browser_1.getUserAgent; } });
Object.defineProperty(exports, "navigateTo", { enumerable: true, get: function () { return Browser_1.navigateTo; } });
Object.defineProperty(exports, "reload", { enumerable: true, get: function () { return Browser_1.reload; } });
// DateTime utilities
var DateTime_1 = require("./src/DateTime");
Object.defineProperty(exports, "add", { enumerable: true, get: function () { return DateTime_1.add; } });
Object.defineProperty(exports, "formatDate", { enumerable: true, get: function () { return DateTime_1.formatDate; } });
Object.defineProperty(exports, "formatDateTime", { enumerable: true, get: function () { return DateTime_1.formatDateTime; } });
Object.defineProperty(exports, "formatDateTimeWithSeconds", { enumerable: true, get: function () { return DateTime_1.formatDateTimeWithSeconds; } });
Object.defineProperty(exports, "formatTime", { enumerable: true, get: function () { return DateTime_1.formatTime; } });
Object.defineProperty(exports, "getDate", { enumerable: true, get: function () { return DateTime_1.getDate; } });
Object.defineProperty(exports, "getNow", { enumerable: true, get: function () { return DateTime_1.getNow; } });
Object.defineProperty(exports, "getYear", { enumerable: true, get: function () { return DateTime_1.getYear; } });
Object.defineProperty(exports, "isSame", { enumerable: true, get: function () { return DateTime_1.isSame; } });
Object.defineProperty(exports, "startOf", { enumerable: true, get: function () { return DateTime_1.startOf; } });
Object.defineProperty(exports, "subtract", { enumerable: true, get: function () { return DateTime_1.subtract; } });
Object.defineProperty(exports, "toISOString", { enumerable: true, get: function () { return DateTime_1.toISOString; } });
// Environment utilities
var Environment_1 = require("./src/Environment");
Object.defineProperty(exports, "getConfigByEnvironment", { enumerable: true, get: function () { return Environment_1.getConfigByEnvironment; } });
Object.defineProperty(exports, "getCurrentEnvironment", { enumerable: true, get: function () { return Environment_1.getCurrentEnvironment; } });
Object.defineProperty(exports, "isDevelopment", { enumerable: true, get: function () { return Environment_1.isDevelopment; } });
Object.defineProperty(exports, "isProduction", { enumerable: true, get: function () { return Environment_1.isProduction; } });
Object.defineProperty(exports, "isStaging", { enumerable: true, get: function () { return Environment_1.isStaging; } });
// Form validation utilities
var Form_1 = require("./src/Form");
Object.defineProperty(exports, "validateFields", { enumerable: true, get: function () { return Form_1.validateFields; } });
Object.defineProperty(exports, "validateSingleField", { enumerable: true, get: function () { return Form_1.validateSingleField; } });
// Logger utilities
var Logger_1 = require("./src/Logger");
Object.defineProperty(exports, "createLogger", { enumerable: true, get: function () { return Logger_1.createLogger; } });
// Path utilities
var Path_1 = require("./src/Path");
Object.defineProperty(exports, "convertFromPathParamsToQueryParams", { enumerable: true, get: function () { return Path_1.convertFromPathParamsToQueryParams; } });
Object.defineProperty(exports, "getUrlWithParamsAndQueryString", { enumerable: true, get: function () { return Path_1.getUrlWithParamsAndQueryString; } });
// Tool utilities
var Tool_1 = require("./src/Tool");
Object.defineProperty(exports, "createRange", { enumerable: true, get: function () { return Tool_1.createRange; } });
Object.defineProperty(exports, "deepClone", { enumerable: true, get: function () { return Tool_1.deepClone; } });
Object.defineProperty(exports, "getProperty", { enumerable: true, get: function () { return Tool_1.getProperty; } });
Object.defineProperty(exports, "setProperty", { enumerable: true, get: function () { return Tool_1.setProperty; } });
Object.defineProperty(exports, "tools", { enumerable: true, get: function () { return Tool_1.tools; } });
// Namespace objects for convenient grouped access
const BrowserModule = __importStar(require("./src/Browser"));
const DateTimeModule = __importStar(require("./src/DateTime"));
const EnvironmentModule = __importStar(require("./src/Environment"));
const FormModule = __importStar(require("./src/Form"));
const LoggerModule = __importStar(require("./src/Logger"));
const PathModule = __importStar(require("./src/Path"));
const ToolModule = __importStar(require("./src/Tool"));
exports.browser = {
    navigateTo: BrowserModule.navigateTo,
    reload: BrowserModule.reload,
    getCurrentUrl: BrowserModule.getCurrentUrl,
    getUserAgent: BrowserModule.getUserAgent,
};
exports.dateTime = {
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
};
exports.environment = {
    getCurrentEnvironment: EnvironmentModule.getCurrentEnvironment,
    isDevelopment: EnvironmentModule.isDevelopment,
    isStaging: EnvironmentModule.isStaging,
    isProduction: EnvironmentModule.isProduction,
    getConfigByEnvironment: EnvironmentModule.getConfigByEnvironment,
};
exports.form = {
    validateSingleField: FormModule.validateSingleField,
    validateFields: FormModule.validateFields,
};
exports.logger = {
    create: LoggerModule.createLogger,
};
exports.path = {
    getUrlWithParamsAndQueryString: PathModule.getUrlWithParamsAndQueryString,
    convertFromPathParamsToQueryParams: PathModule.convertFromPathParamsToQueryParams,
};
exports.tool = {
    getProperty: ToolModule.getProperty,
    setProperty: ToolModule.setProperty,
    deepClone: ToolModule.deepClone,
    createRange: ToolModule.createRange,
};
// es-toolkit utilities re-export for convenient access
var compat_1 = require("es-toolkit/compat");
// Additional utilities
Object.defineProperty(exports, "castArray", { enumerable: true, get: function () { return compat_1.castArray; } });
// Object manipulation
Object.defineProperty(exports, "cloneDeep", { enumerable: true, get: function () { return compat_1.cloneDeep; } });
Object.defineProperty(exports, "defaultsDeep", { enumerable: true, get: function () { return compat_1.defaultsDeep; } });
// Object utilities
Object.defineProperty(exports, "get", { enumerable: true, get: function () { return compat_1.get; } });
// Type checking
Object.defineProperty(exports, "isEmpty", { enumerable: true, get: function () { return compat_1.isEmpty; } });
Object.defineProperty(exports, "isNil", { enumerable: true, get: function () { return compat_1.isNil; } });
Object.defineProperty(exports, "isString", { enumerable: true, get: function () { return compat_1.isString; } });
Object.defineProperty(exports, "mapValues", { enumerable: true, get: function () { return compat_1.mapValues; } });
Object.defineProperty(exports, "merge", { enumerable: true, get: function () { return compat_1.merge; } });
// Array utilities
Object.defineProperty(exports, "range", { enumerable: true, get: function () { return compat_1.range; } });
Object.defineProperty(exports, "set", { enumerable: true, get: function () { return compat_1.set; } });
//# sourceMappingURL=index.js.map