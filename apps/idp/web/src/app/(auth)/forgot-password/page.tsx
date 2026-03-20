"use client";

import dynamic from "next/dynamic";

const ForgotPasswordClient = dynamic(
	() => import("./_client").then((module) => module.ForgotPasswordClient),
	{
		ssr: false,
	},
);

export default function ForgotPasswordPage() {
	return <ForgotPasswordClient />;
}
