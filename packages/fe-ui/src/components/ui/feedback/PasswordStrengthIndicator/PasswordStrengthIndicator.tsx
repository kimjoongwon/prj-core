"use client";

import type { PasswordRule } from "@cocrepo/constant";
import { observer } from "mobx-react-lite";

export interface PasswordStrengthIndicatorProps {
	/** 현재 입력된 비밀번호 */
	password: string;
	/** 비밀번호 정책 규칙 목록 */
	rules: PasswordRule[];
}

/**
 * 비밀번호 강도 표시기
 *
 * 비밀번호 정책 규칙의 충족 여부를 실시간으로 표시합니다.
 */
export const PasswordStrengthIndicator = observer(
	({ password, rules }: PasswordStrengthIndicatorProps) => {
		const results = rules.map((r) => ({
			...r,
			passed: password.length > 0 ? r.test(password) : false,
		}));

		if (!password) return null;

		return (
			<div className="space-y-1.5 mt-2">
				{results.map((r) => (
					<div key={r.rule} className="flex items-center gap-2 text-sm">
						{r.passed ? (
							<svg
								className="w-4 h-4 text-success shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						) : (
							<svg
								className="w-4 h-4 text-default-400 shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						)}
						<span
							className={
								r.passed ? "text-success" : "text-default-400"
							}
						>
							{r.label}
						</span>
					</div>
				))}
			</div>
		);
	},
);

PasswordStrengthIndicator.displayName = "PasswordStrengthIndicator";
