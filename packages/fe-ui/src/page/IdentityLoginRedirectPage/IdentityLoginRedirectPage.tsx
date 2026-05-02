"use client";

import { Spinner } from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Button } from "../../control";
import { ThemeToggleButton } from "../../feature";
import { useT } from "../../i18n";

export interface IdentityLoginRedirectPageProps {
	errorMessage: string;
	isRedirecting: boolean;
	onClickRetry?: () => void;
	topActions?: ReactNode;
}

export const IdentityLoginRedirectPage = observer(
	({
		errorMessage,
		isRedirecting,
		onClickRetry,
		topActions,
	}: IdentityLoginRedirectPageProps) => {
		const t = useT();

		return (
			<div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-[#090c12]">
				<div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
					{topActions}
					<ThemeToggleButton />
				</div>
				<div className="w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white/92 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/92 dark:shadow-[0_24px_72px_-40px_rgba(0,0,0,0.72)]">
					{isRedirecting ? (
						<div className="flex flex-col items-center gap-4 text-center">
							<Spinner size="lg" />
							<p className="text-slate-600 dark:text-slate-300">
								{t("로그인 페이지로 이동 중...")}
							</p>
						</div>
					) : (
						<div className="flex flex-col items-center gap-6">
							<div className="text-center">
								<h3 className="text-2xl font-bold text-slate-950 dark:text-slate-50">
									{t("로그인 실패")}
								</h3>
								<p className="mt-2 text-sm text-danger">{errorMessage}</p>
							</div>
							<Button
								color="primary"
								size="lg"
								fullWidth
								onPress={onClickRetry}
								isDisabled={!onClickRetry}
							>
								{t("다시 로그인")}
							</Button>
						</div>
					)}
				</div>
			</div>
		);
	},
);

IdentityLoginRedirectPage.displayName = "IdentityLoginRedirectPage";
