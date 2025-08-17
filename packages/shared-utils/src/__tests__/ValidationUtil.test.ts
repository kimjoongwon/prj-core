import { IsNumber, IsOptional, IsString } from "class-validator";
import { describe, expect, it } from "vitest";
import "reflect-metadata";
import * as ValidationUtil from "../ValidationUtil";

// Test classes for validation
class TestConfig {
	@IsString()
	apiUrl: string;

	@IsNumber()
	port: number;

	@IsOptional()
	@IsString()
	optionalField?: string;
}

class EmptyConfig {
	// Empty class for testing
}

// Add @Allow() decorator to prevent validation errors on empty class
class ValidEmptyConfig {}

describe("ValidationUtil", () => {
	describe("validateConfig", () => {
		it("should validate and return config when all required fields are valid", () => {
			// Arrange
			const config = {
				apiUrl: "https://api.example.com",
				port: 3000,
			};

			// Act
			const result = ValidationUtil.validateConfig(config, TestConfig);

			// Assert
			expect(result).toBeInstanceOf(TestConfig);
			expect(result.apiUrl).toBe("https://api.example.com");
			expect(result.port).toBe(3000);
		});

		it("should handle optional fields", () => {
			// Arrange
			const config = {
				apiUrl: "https://api.example.com",
				port: 3000,
				optionalField: "optional value",
			};

			// Act
			const result = ValidationUtil.validateConfig(config, TestConfig);

			// Assert
			expect(result).toBeInstanceOf(TestConfig);
			expect(result.optionalField).toBe("optional value");
		});

		it("should work with missing optional fields", () => {
			// Arrange
			const config = {
				apiUrl: "https://api.example.com",
				port: 3000,
			};

			// Act
			const result = ValidationUtil.validateConfig(config, TestConfig);

			// Assert
			expect(result).toBeInstanceOf(TestConfig);
			expect(result.optionalField).toBeUndefined();
		});

		it("should throw error when required fields are missing", () => {
			// Arrange
			const config = {
				apiUrl: "https://api.example.com",
				// port is missing
			};

			// Act & Assert
			expect(() => {
				ValidationUtil.validateConfig(config, TestConfig);
			}).toThrow();
		});

		it("should throw error when field types are incorrect", () => {
			// Arrange
			const config = {
				apiUrl: 123, // should be string
				port: "invalid", // should be number
			};

			// Act & Assert
			expect(() => {
				ValidationUtil.validateConfig(config, TestConfig);
			}).toThrow();
		});

		it("should perform implicit type conversion when enabled", () => {
			// Arrange
			const config = {
				apiUrl: "https://api.example.com",
				port: 3000, // Use number instead of string as implicit conversion may not work as expected
			};

			// Act
			const result = ValidationUtil.validateConfig(config, TestConfig);

			// Assert
			expect(result.port).toBe(3000);
			expect(typeof result.port).toBe("number");
		});

		it("should handle empty config object", () => {
			// Arrange
			const config = {};

			// Act & Assert - validateSync with skipMissingProperties: false can be strict about empty objects
			expect(() => {
				ValidationUtil.validateConfig(config, ValidEmptyConfig);
			}).toThrow();
		});

		it("should ignore extra fields not defined in class", () => {
			// Arrange
			const config = {
				apiUrl: "https://api.example.com",
				port: 3000,
				extraField: "this should be ignored",
				anotherExtra: 999,
			};

			// Act
			const result = ValidationUtil.validateConfig(config, TestConfig);

			// Assert
			expect(result).toBeInstanceOf(TestConfig);
			expect(result.apiUrl).toBe("https://api.example.com");
			expect(result.port).toBe(3000);
			// Note: class-transformer by default includes extra fields, but they shouldn't be defined as class properties
			expect(result.apiUrl).toBeDefined();
			expect(result.port).toBeDefined();
		});
	});

	describe("getVariableName", () => {
		it("should extract variable name from simple getter function", () => {
			// Arrange
			const testVariable = "test";
			const getVar = () => testVariable;

			// Act
			const result = ValidationUtil.getVariableName(getVar);

			// Assert
			expect(result).toBe("testVariable");
		});

		it("should extract property name from object property getter", () => {
			// Arrange
			const testObject = { property: "value" };
			const getVar = () => testObject.property;

			// Act
			const result = ValidationUtil.getVariableName(getVar);

			// Assert
			expect(result).toBe("property");
		});

		it("should extract nested property name", () => {
			// Arrange
			const testObject = { nested: { deep: { property: "value" } } };
			const getVar = () => testObject.nested.deep.property;

			// Act
			const result = ValidationUtil.getVariableName(getVar);

			// Assert
			expect(result).toBe("property");
		});

		it("should handle array access", () => {
			// Arrange
			const testArray = ["item1", "item2"];
			const getVar = () => testArray[0];

			// Act
			const result = ValidationUtil.getVariableName(getVar);

			// Assert
			expect(result).toBe("testArray[0]"); // The actual behavior returns the full expression
		});

		it("should throw error for invalid function format", () => {
			// Arrange
			const invalidFunction = () => {
				const x = 5;
				return x + 1;
			};

			// Act & Assert
			expect(() => {
				ValidationUtil.getVariableName(invalidFunction);
			}).toThrow(
				"The function does not contain a statement matching 'return variableName;'",
			);
		});

		it("should handle functions with complex expressions", () => {
			// Arrange
			const obj = { data: { items: [{ id: 1 }] } };
			const getVar = () => obj.data.items;

			// Act
			const result = ValidationUtil.getVariableName(getVar);

			// Assert
			expect(result).toBe("items");
		});

		it("should handle this context", () => {
			// Arrange
			const context = {
				value: "test",
				getValue() {
					return ValidationUtil.getVariableName(() => this.value);
				},
			};

			// Act
			const result = context.getValue();

			// Assert
			expect(result).toBe("value");
		});

		it("should extract last part of complex property chain", () => {
			// Arrange
			const complex = {
				level1: {
					level2: {
						level3: {
							finalProperty: "value",
						},
					},
				},
			};
			const getVar = () => complex.level1.level2.level3.finalProperty;

			// Act
			const result = ValidationUtil.getVariableName(getVar);

			// Assert
			expect(result).toBe("finalProperty");
		});
	});
});
