const KEY_PREFIX = "oidc";

export function oidcAdapterKey(modelType: string, id: string): string {
	return `${KEY_PREFIX}:${modelType}:${id}`;
}

export function oidcAdapterUidKey(modelType: string, uid: string): string {
	return `${KEY_PREFIX}:${modelType}:uid:${uid}`;
}

export function oidcAdapterUserCodeKey(
	modelType: string,
	userCode: string,
): string {
	return `${KEY_PREFIX}:${modelType}:userCode:${userCode}`;
}

export function oidcAdapterGrantKey(
	modelType: string,
	grantId: string,
): string {
	return `${KEY_PREFIX}:${modelType}:grant:${grantId}`;
}
