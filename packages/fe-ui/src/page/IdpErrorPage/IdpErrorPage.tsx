"use client";

import { observer } from "mobx-react-lite";
import { Button } from "../../control";
import { AuthCard, AuthCardHeader } from "../../widget";

export interface IdpErrorPageProps {
	error: string;
	errorDescription: string;
	onClickBack: () => void;
}

export const IdpErrorPage = observer(
	({ error, errorDescription, onClickBack }: IdpErrorPageProps) => {
		return (
			<AuthCard variant="danger">
				<AuthCardHeader
					iconPath="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
					iconGradient="from-danger to-danger-400"
					title="오류 발생"
					titleClassName="text-danger"
				/>

				<div className="space-y-4">
					<div className="rounded-lg border border-danger/30 bg-danger/10 p-4">
						<p className="text-sm font-medium text-danger">{error}</p>
						{errorDescription ? (
							<p className="mt-2 text-sm text-default-500">
								{errorDescription}
							</p>
						) : null}
					</div>
				</div>

				<div className="mt-6 text-center">
					<Button variant="light" onPress={onClickBack}>
						돌아가기
					</Button>
				</div>
			</AuthCard>
		);
	},
);

IdpErrorPage.displayName = "IdpErrorPage";
