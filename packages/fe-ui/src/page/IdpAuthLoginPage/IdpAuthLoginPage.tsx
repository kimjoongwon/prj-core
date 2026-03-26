"use client";

import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Button } from "../../control";
import { ThemeToggleButton } from "../../feature";

export interface IdpAuthLoginPageProps {
	errorMessage: string;
	isRedirecting: boolean;
	onClickRetry?: () => void;
}

export const IdpAuthLoginPage = observer(
	({ errorMessage, isRedirecting, onClickRetry }: IdpAuthLoginPageProps) => {
		return (
			<div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-[#090c12]">
				<ThemeToggleButton className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6" />
				<div className="w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white/92 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/92 dark:shadow-[0_24px_72px_-40px_rgba(0,0,0,0.72)]">
					{isRedirecting ? (
						<div className="flex flex-col items-center gap-4 text-center">
							<Spinner size="lg" />
							<p className="text-slate-600 dark:text-slate-300">
								로그인 페이지로 이동 중...
							</p>
						</div>
					) : (
						<div className="flex flex-col items-center gap-6">
							<div className="text-center">
								<h3 className="text-2xl font-bold text-slate-950 dark:text-slate-50">
									로그인 실패
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
								다시 로그인
							</Button>
						</div>
					)}
				</div>
			</div>
		);
	},
);

IdpAuthLoginPage.displayName = "IdpAuthLoginPage";
