describe("모바일 앱 스모크", () => {
	beforeAll(async () => {
		await device.launchApp({ newInstance: true });
	});

	it("인벤토리 홈 화면이 표시되어야 한다", async () => {
		await expect(element(by.text("모바일 컴포넌트 인벤토리"))).toBeVisible();
		await expect(element(by.text("Button Showcase"))).toBeVisible();
	});
});
