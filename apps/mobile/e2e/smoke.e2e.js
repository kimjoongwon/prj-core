const { execFileSync } = require("node:child_process");

describe("모바일 앱 스모크", () => {
	const bundleId = "com.anonymous.plate-mobile";
	const expoDevClientUrl =
		process.env.DETOX_EXPO_DEV_CLIENT_URL ??
		"com.anonymous.plate-mobile://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081";

	const configureExpoDevClient = () => {
		execFileSync("xcrun", [
			"simctl",
			"spawn",
			device.id,
			"defaults",
			"write",
			bundleId,
			"EXDevMenuIsOnboardingFinished",
			"-bool",
			"YES",
		]);
		execFileSync("xcrun", [
			"simctl",
			"spawn",
			device.id,
			"defaults",
			"write",
			bundleId,
			"EXDevMenuShowsAtLaunch",
			"-bool",
			"NO",
		]);
	};

	beforeAll(async () => {
		configureExpoDevClient();
		await device.launchApp({ newInstance: true });
		await device.disableSynchronization();
		await device.openURL({ url: expoDevClientUrl });
	});

	it("MO-E2E-004 인증 전 로그인 화면이 표시되어야 한다", async () => {
		await waitFor(element(by.text("ONORA")))
			.toBeVisible()
			.withTimeout(30000);
		await expect(element(by.label("이메일")).atIndex(0)).toBeVisible();
		await expect(element(by.label("비밀번호")).atIndex(0)).toBeVisible();
		await expect(element(by.label("login-submit"))).toBeVisible();
		await expect(element(by.text("예약을 시작하세요"))).not.toBeVisible();
		await expect(element(by.text("모바일 컴포넌트 인벤토리"))).not.toBeVisible();
		await expect(element(by.text("Button Showcase"))).not.toBeVisible();
	});
});
