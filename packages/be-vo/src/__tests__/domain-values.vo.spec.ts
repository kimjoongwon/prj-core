import {
	EmailDomain,
	EmailVerificationToken,
	OidcClientId,
	PasswordResetToken,
	RedirectUri,
	SessionId,
	WhitelistValue,
} from "../index";

describe("domain value objects", () => {
	it("creates session ids", () => {
		const sessionId = SessionId.create("ADMIN-WEB", SessionId.generateRawId());

		expect(sessionId.value).toBe(`admin-web.${sessionId.rawId}`);
		expect(SessionId.fromString(sessionId.value).clientId).toBe("admin-web");
	});

	it("hashes verification tokens consistently", () => {
		const emailToken = EmailVerificationToken.generate();
		const resetToken = PasswordResetToken.create(emailToken.value);

		expect(emailToken.toHash()).toHaveLength(64);
		expect(resetToken.toHash()).toHaveLength(64);
	});

	it("normalizes whitelist values by type", () => {
		expect(WhitelistValue.create("EMAIL_DOMAIN", "@Example.COM").value).toBe(
			"example.com",
		);
		expect(() =>
			WhitelistValue.create("CORS_ORIGIN", "https://example.com/a"),
		).toThrow();
		expect(WhitelistValue.create("IP", "127.0.0.1/32").value).toBe(
			"127.0.0.1/32",
		);
	});

	it("validates oidc ids and redirect uris", () => {
		expect(OidcClientId.create("Admin-Web").value).toBe("admin-web");
		expect(
			RedirectUri.create("kr.co.cocdev.onoramobile://auth/callback").value,
		).toBe("kr.co.cocdev.onoramobile://auth/callback");
		expect(() => OidcClientId.create("admin_web")).toThrow();
		expect(() => EmailDomain.create("https://example.com")).toThrow();
	});
});
