import {
	CurrencyCode,
	EmailDomain,
	EmailVerificationToken,
	Money,
	NativeRefreshToken,
	OidcClientId,
	PasswordResetToken,
	RedirectUri,
	SessionId,
	WhitelistValue,
} from "../index";

describe("domain value objects", () => {
	it("creates native refresh tokens and session ids", () => {
		const refreshToken = NativeRefreshToken.generate();
		const sessionId = SessionId.create("ADMIN-WEB", SessionId.generateRawId());

		expect(refreshToken.value).toMatch(/^[A-Za-z0-9_-]{43}$/);
		expect(sessionId.value).toBe(`admin-web.${sessionId.rawId}`);
		expect(SessionId.fromString(sessionId.value).clientId).toBe("admin-web");
	});

	it("hashes verification tokens consistently", () => {
		const emailToken = EmailVerificationToken.generate();
		const resetToken = PasswordResetToken.create(emailToken.value);

		expect(emailToken.toHash()).toHaveLength(64);
		expect(resetToken.toHash()).toHaveLength(64);
	});

	it("normalizes money and currency values", () => {
		const currency = CurrencyCode.create("krw");
		const total = Money.of(1000, currency).multiply(2);

		expect(currency.value).toBe("KRW");
		expect(total.amount).toBe(2000);
		expect(total.currencyValue).toBe("KRW");
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
