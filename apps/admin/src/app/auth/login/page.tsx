"use client";

import { Button, Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Suspense } from "react";

import { useAuthLoginPage } from "./hooks";

const LoginContent = observer(() => {
	const { errorMessage, isRedirecting, onClickRetry } = useAuthLoginPage();

	if (isRedirecting) {
		return (
			<div className="flex flex-col items-center gap-4 p-8">
				<Spinner size="lg" />
				<p className="text-default-500">로그인 페이지로 이동 중...</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-6 p-8">
			<div className="text-center">
				<h3 className="text-2xl font-bold">로그인 실패</h3>
				<p className="mt-2 text-sm text-danger">{errorMessage}</p>
			</div>
			<Button color="primary" size="lg" fullWidth onPress={onClickRetry}>
				다시 로그인
			</Button>
		</div>
	);
});

const Page = () => {
	return (
		<Suspense
			fallback={
				<div className="flex flex-col items-center gap-4 p-8">
					<Spinner size="lg" />
				</div>
			}
		>
			<LoginContent />
		</Suspense>
	);
};

export default Page;
