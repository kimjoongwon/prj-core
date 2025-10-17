import { describe, expect, it } from "vitest";
import * as utils from "../../index";

describe("Index exports", () => {
	it("should export all utility functions", () => {
		// Browser utilities
		expect(utils.navigateTo).toBeDefined();
		expect(utils.reload).toBeDefined();
		expect(utils.getCurrentUrl).toBeDefined();
		expect(utils.getUserAgent).toBeDefined();

		// DateTime utilities
		expect(utils.getNow).toBeDefined();
		expect(utils.formatDate).toBeDefined();
		expect(utils.formatDateTime).toBeDefined();
		expect(utils.formatDateTimeWithSeconds).toBeDefined();

		// Environment utilities
		expect(utils.getCurrentEnvironment).toBeDefined();
		expect(utils.isDevelopment).toBeDefined();
		expect(utils.isStaging).toBeDefined();
		expect(utils.isProduction).toBeDefined();

		// Form validation utilities
		expect(utils.validateSingleField).toBeDefined();
		expect(utils.validateFields).toBeDefined();

		// Logger utilities
		expect(utils.createLogger).toBeDefined();

		// Path utilities
		expect(utils.getUrlWithParamsAndQueryString).toBeDefined();
		expect(utils.convertFromPathParamsToQueryParams).toBeDefined();

		// Tool utilities
		expect(utils.getProperty).toBeDefined();
		expect(utils.setProperty).toBeDefined();
		expect(utils.deepClone).toBeDefined();
		expect(utils.createRange).toBeDefined();

		// Validation utilities
		expect(utils.validateConfig).toBeDefined();
		expect(utils.getVariableName).toBeDefined();
	});

	it("should export namespace objects", () => {
		// Namespace objects
		expect(utils.browser).toBeDefined();
		expect(utils.dateTime).toBeDefined();
		expect(utils.environment).toBeDefined();
		expect(utils.form).toBeDefined();
		expect(utils.logger).toBeDefined();
		expect(utils.path).toBeDefined();
		expect(utils.tool).toBeDefined();
		expect(utils.validation).toBeDefined();

		// Check that namespace objects contain expected functions
		expect(utils.browser.navigateTo).toBeDefined();
		expect(utils.dateTime.formatDate).toBeDefined();
		expect(utils.environment.isDevelopment).toBeDefined();
		expect(utils.form.validateSingleField).toBeDefined();
		expect(utils.logger.create).toBeDefined();
		expect(utils.path.getUrlWithParamsAndQueryString).toBeDefined();
		expect(utils.tool.deepClone).toBeDefined();
		expect(utils.validation.validateConfig).toBeDefined();
	});
});
