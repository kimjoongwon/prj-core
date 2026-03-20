"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ErrorClient = dynamic(
	() => import("./_client").then((module) => module.ErrorClient),
	{
		ssr: false,
	},
);

export default function ErrorPage() {
	const [errorState, setErrorState] = useState({
		error: "알 수 없는 오류가 발생했습니다.",
		errorDescription: "",
	});

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);

		setErrorState({
			error: searchParams.get("error") || "알 수 없는 오류가 발생했습니다.",
			errorDescription: searchParams.get("error_description") || "",
		});
	}, []);

	return (
		<ErrorClient
			error={errorState.error}
			errorDescription={errorState.errorDescription}
		/>
	);
}
