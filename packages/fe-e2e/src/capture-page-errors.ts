export function capturePageErrors(page: {
	on(event: "pageerror", handler: (error: Error) => void): void;
}) {
	const pageErrors: string[] = [];
	page.on("pageerror", (error) => {
		pageErrors.push(error.message);
	});

	return pageErrors;
}
