"use client";

import { IdpErrorPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

const ErrorPage = observer(function ErrorPage() {
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
		<IdpErrorPage
			error={errorState.error}
			errorDescription={errorState.errorDescription}
			onClickBack={() => window.history.back()}
		/>
	);
});

export default ErrorPage;
