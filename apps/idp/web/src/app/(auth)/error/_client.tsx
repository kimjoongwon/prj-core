"use client";

import { AuthCard, AuthCardHeader } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

interface ErrorClientProps {
	error: string;
	errorDescription: string;
}

/**
 * OIDC 에러 표시 클라이언트 컴포넌트
 */
export const ErrorClient = observer(function ErrorClient({
	error,
	errorDescription,
}: ErrorClientProps) {
	return (
		<AuthCard variant="danger">
			<AuthCardHeader
				iconPath="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
				iconGradient="from-danger to-danger-400"
				title="오류 발생"
				titleClassName="text-danger"
			/>

			{/* 에러 상세 */}
			<div className="space-y-4">
				<div className="bg-danger/10 border border-danger/30 rounded-lg p-4">
					<p className="text-sm text-danger font-medium">{error}</p>
					{errorDescription && (
						<p className="text-sm text-default-500 mt-2">{errorDescription}</p>
					)}
				</div>
			</div>

			{/* 돌아가기 */}
			<div className="mt-6 text-center">
				<button
					type="button"
					className="px-6 py-2.5 bg-default-100 hover:bg-default-200 text-foreground font-medium rounded-lg transition-colors"
					onClick={() => window.history.back()}
				>
					돌아가기
				</button>
			</div>
		</AuthCard>
	);
});
