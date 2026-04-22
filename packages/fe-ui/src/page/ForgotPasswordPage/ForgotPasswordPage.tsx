"use client";

import { observer } from "mobx-react-lite";
import { ForgotPasswordForm } from "../../form";

export interface ForgotPasswordPageProps {
	onSubmit: (email: string) => Promise<string | null>;
}

export const ForgotPasswordPage = observer(
	({ onSubmit }: ForgotPasswordPageProps) => {
		return <ForgotPasswordForm onSubmit={onSubmit} />;
	},
);

ForgotPasswordPage.displayName = "ForgotPasswordPage";
