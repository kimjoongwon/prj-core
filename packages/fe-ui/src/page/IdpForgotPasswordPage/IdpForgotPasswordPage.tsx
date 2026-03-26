"use client";

import { observer } from "mobx-react-lite";
import { ForgotPasswordForm } from "../../form";

export interface IdpForgotPasswordPageProps {
	onSubmit: (email: string) => Promise<string | null>;
}

export const IdpForgotPasswordPage = observer(
	({ onSubmit }: IdpForgotPasswordPageProps) => {
		return <ForgotPasswordForm onSubmit={onSubmit} />;
	},
);

IdpForgotPasswordPage.displayName = "IdpForgotPasswordPage";
