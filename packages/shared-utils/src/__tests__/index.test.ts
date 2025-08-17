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
});