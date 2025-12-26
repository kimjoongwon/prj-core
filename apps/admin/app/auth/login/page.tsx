"use client";

import { useLogin } from "@cocrepo/api";
import { LoginPage } from "@cocrepo/ui";
import { useRouter } from "next/navigation";

const LoginPageWrapper = () => {
	const router = useRouter();
	const loginMutation = useLogin();

	return <LoginPage loginMutation={loginMutation} router={router} />;
};

export default LoginPageWrapper;
