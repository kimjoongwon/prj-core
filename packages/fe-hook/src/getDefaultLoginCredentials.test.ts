import { describe, expect, it } from "vitest";
import {
	LOCAL_LOGIN_EMAIL,
	LOCAL_LOGIN_PASSWORD,
} from "./auth-login.constants";
import { getDefaultLoginCredentials } from "./getDefaultLoginCredentials";

describe("getDefaultLoginCredentials", () => {
	it("development 환경에서는 로컬 기본 계정을 반환합니다.", () => {
		expect(getDefaultLoginCredentials("development")).toEqual({
			email: LOCAL_LOGIN_EMAIL,
			password: LOCAL_LOGIN_PASSWORD,
		});
	});

	it("development가 아닌 환경에서는 빈 기본값을 반환합니다.", () => {
		expect(getDefaultLoginCredentials("production")).toEqual({
			email: "",
			password: "",
		});
	});
});
