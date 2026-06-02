import {
	LOCAL_ADMIN_LOGIN_EMAIL,
	LOCAL_ADMIN_LOGIN_PASSWORD,
} from "./admin-login-defaults.constants";

export const getDefaultAdminLoginCredentials = (
	nodeEnv = process.env.NODE_ENV,
) => {
	if (nodeEnv !== "development") {
		return {
			email: "",
			password: "",
		};
	}

	return {
		email: LOCAL_ADMIN_LOGIN_EMAIL,
		password: LOCAL_ADMIN_LOGIN_PASSWORD,
	};
};
