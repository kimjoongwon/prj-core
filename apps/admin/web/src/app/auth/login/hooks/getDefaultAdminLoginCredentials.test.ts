import { describe, expect, it } from "vitest";
import {
	LOCAL_ADMIN_LOGIN_EMAIL,
	LOCAL_ADMIN_LOGIN_PASSWORD,
} from "./admin-login-defaults.constants";
import { getDefaultAdminLoginCredentials } from "./getDefaultAdminLoginCredentials";

describe("getDefaultAdminLoginCredentials", () => {
	it("개발 환경에서는 로컬 관리자 계정을 기본값으로 제공한다", () => {
		expect(getDefaultAdminLoginCredentials("development")).toEqual({
			email: LOCAL_ADMIN_LOGIN_EMAIL,
			password: LOCAL_ADMIN_LOGIN_PASSWORD,
		});
	});

	it("개발 환경이 아니면 로그인 폼을 비워둔다", () => {
		expect(getDefaultAdminLoginCredentials("test")).toEqual({
			email: "",
			password: "",
		});
		expect(getDefaultAdminLoginCredentials("production")).toEqual({
			email: "",
			password: "",
		});
	});
});
