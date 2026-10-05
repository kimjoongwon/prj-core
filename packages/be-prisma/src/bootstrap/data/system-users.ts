export interface SystemAdminSeedData {
	email: string;
	phone: string;
	password: string;
	profile: { name: string; nickname: string };
}

/**
 * 환경 부팅에 필요한 시스템 관리자 계정입니다.
 *
 * demo 사용자와 달리 새 환경을 바로 운영 가능한 상태로 만들기 위한 기본 계정이므로,
 * bootstrap과 운영 data migration이 같은 정의를 재사용합니다.
 */
const requiredEnvironmentValue = (name: string): string => {
	const value = process.env[name]?.trim();
	if (!value) throw new Error(`Missing required bootstrap environment variable: ${name}`);
	return value;
};

export function resolveSystemAdminSeedData(): SystemAdminSeedData[] {
	const isProduction = process.env.NODE_ENV === "production";
	const email = requiredEnvironmentValue("LOCAL_BOOTSTRAP_ADMIN_EMAIL");
	const password = requiredEnvironmentValue("LOCAL_BOOTSTRAP_ADMIN_PASSWORD");
	const phone = isProduction ? requiredEnvironmentValue("BOOTSTRAP_ADMIN_PHONE") : process.env.LOCAL_BOOTSTRAP_ADMIN_PHONE?.trim() || "00000000000";
	const name = process.env.LOCAL_BOOTSTRAP_ADMIN_NAME?.trim() || (isProduction ? requiredEnvironmentValue("BOOTSTRAP_ADMIN_NAME") : "Local Administrator");
	const nickname = process.env.LOCAL_BOOTSTRAP_ADMIN_NICKNAME?.trim() || (isProduction ? requiredEnvironmentValue("BOOTSTRAP_ADMIN_NICKNAME") : "local-admin");
	return [{ email, phone, password, profile: { name, nickname } }];
}
