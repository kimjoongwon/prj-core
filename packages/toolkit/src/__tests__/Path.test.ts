import { describe, expect, it } from "vitest";
import * as PathUtil from "../Path";

describe("PathUtil", () => {
	describe("getUrlWithParamsAndQueryString", () => {
		it("should return original url when no params and no query string", () => {
			// Arrange
			const url = "/api/users";

			// Act
			const result = PathUtil.getUrlWithParamsAndQueryString(url);

			// Assert
			expect(result).toBe("/api/users");
		});

		it("should return original url when empty params object and no query string", () => {
			// Arrange
			const url = "/api/users";
			const params = {};

			// Act
			const result = PathUtil.getUrlWithParamsAndQueryString(url, params);

			// Assert
			expect(result).toBe("/api/users");
		});

		it("should replace path parameters when params are provided", () => {
			// Arrange
			const url = "/api/users/:id";
			const params = { id: "123" };

			// Act
			const result = PathUtil.getUrlWithParamsAndQueryString(url, params);

			// Assert
			expect(result).toBe("/api/users/123");
		});

		it("should append query string when provided", () => {
			// Arrange
			const url = "/api/users";
			const queryString = "page=1&limit=10";

			// Act
			const result = PathUtil.getUrlWithParamsAndQueryString(
				url,
				{},
				queryString,
			);

			// Assert
			expect(result).toBe("/api/users?page=1&limit=10");
		});

		it("should replace path parameters and append query string", () => {
			// Arrange
			const url = "/api/users/:id/posts/:postId";
			const params = { id: "123", postId: "456" };
			const queryString = "include=comments";

			// Act
			const result = PathUtil.getUrlWithParamsAndQueryString(
				url,
				params,
				queryString,
			);

			// Assert
			expect(result).toBe("/api/users/123/posts/456?include=comments");
		});

		it("should handle multiple path parameters", () => {
			// Arrange
			const url = "/api/organizations/:orgId/projects/:projectId/tasks/:taskId";
			const params = { orgId: "org1", projectId: "proj2", taskId: "task3" };

			// Act
			const result = PathUtil.getUrlWithParamsAndQueryString(url, params);

			// Assert
			expect(result).toBe("/api/organizations/org1/projects/proj2/tasks/task3");
		});

		it("should handle undefined params gracefully", () => {
			// Arrange
			const url = "/api/users";

			// Act
			const result = PathUtil.getUrlWithParamsAndQueryString(url, undefined);

			// Assert
			expect(result).toBe("/api/users");
		});
	});

	describe("convertFromPathParamsToQueryParams", () => {
		it("should convert path params to query params", () => {
			// Arrange
			const pathParamKeys = ["userId", "postId"];
			const pathParams = { userId: "123", postId: "456", extra: "ignored" };

			// Act
			const result = PathUtil.convertFromPathParamsToQueryParams({
				pathParamKeys,
				pathParams,
			});

			// Assert
			expect(result).toEqual({
				userId: "123",
				postId: "456",
			});
		});

		it("should handle missing values in pathParams", () => {
			// Arrange
			const pathParamKeys = ["userId", "postId", "commentId"];
			const pathParams = { userId: "123" };

			// Act
			const result = PathUtil.convertFromPathParamsToQueryParams({
				pathParamKeys,
				pathParams,
			});

			// Assert
			expect(result).toEqual({
				userId: "123",
				postId: undefined,
				commentId: undefined,
			});
		});

		it("should handle empty pathParamKeys array", () => {
			// Arrange
			const pathParamKeys: string[] = [];
			const pathParams = { userId: "123", postId: "456" };

			// Act
			const result = PathUtil.convertFromPathParamsToQueryParams({
				pathParamKeys,
				pathParams,
			});

			// Assert
			expect(result).toEqual({});
		});

		it("should handle null/undefined pathParams", () => {
			// Arrange
			const pathParamKeys = ["userId", "postId"];
			const pathParams = null;

			// Act
			const result = PathUtil.convertFromPathParamsToQueryParams({
				pathParamKeys,
				pathParams,
			});

			// Assert
			expect(result).toEqual({
				userId: undefined,
				postId: undefined,
			});
		});

		it("should preserve different value types", () => {
			// Arrange
			const pathParamKeys = ["id", "count", "active"];
			const pathParams = { id: "123", count: 42, active: true };

			// Act
			const result = PathUtil.convertFromPathParamsToQueryParams({
				pathParamKeys,
				pathParams,
			});

			// Assert
			expect(result).toEqual({
				id: "123",
				count: 42,
				active: true,
			});
		});
	});
});
