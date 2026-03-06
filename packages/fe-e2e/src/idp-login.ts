import {
	navigateToOidcLoginForm,
	runOidcLoginFlow,
	submitOidcCredentials,
	waitForOidcConsentForm,
	type E2EPageLike,
} from "./oidc-login";

export async function loginToConsole(page: E2EPageLike) {
	await runOidcLoginFlow(page, {
		startPath: "/auth/login",
		finalUrl: /\/oidc-clients/,
		allowDirectRedirect: true,
	});
}

export async function navigateToLoginForm(page: E2EPageLike) {
	await navigateToOidcLoginForm(page, {
		startPath: "/auth/login",
	});
}

export async function navigateToConsentForm(page: E2EPageLike) {
	await navigateToOidcLoginForm(page, {
		startPath: "/auth/login",
	});
	await submitOidcCredentials(page);
	await waitForOidcConsentForm(page);
}
