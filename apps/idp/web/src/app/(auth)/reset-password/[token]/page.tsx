"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ResetPasswordClient = dynamic(
	() => import("./_client").then((module) => module.ResetPasswordClient),
	{
		ssr: false,
	},
);

type ResetPasswordPageParams = {
	token: string;
};

export default function ResetPasswordPage() {
	const { token } = useParams<ResetPasswordPageParams>();

	return <ResetPasswordClient token={token} />;
}
