describe("모바일 앱 스모크", () => {
	beforeAll(async () => {
		await device.launchApp({ newInstance: true });
	});

	it("MO-E2E-004 홈 예약 시작 화면이 표시되어야 한다", async () => {
		await waitFor(element(by.text("예약을 시작하세요")))
			.toBeVisible()
			.withTimeout(5000);
		await expect(element(by.text("오노라"))).toBeVisible();
		await expect(element(by.text("예약 대상"))).toBeVisible();
		await expect(element(by.text("예약 요청 제출"))).toBeVisible();
		await expect(element(by.text("모바일 컴포넌트 인벤토리"))).not.toBeVisible();
		await expect(element(by.text("Button Showcase"))).not.toBeVisible();
	});
});
