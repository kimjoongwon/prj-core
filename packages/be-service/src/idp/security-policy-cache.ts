export interface SecurityPolicyCache {
	temporaryLockThreshold: number;
	permanentLockThreshold: number;
	temporaryLockDurationMs: number;
	cachedAt: number;
}
