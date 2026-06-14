"use client";

import { useRequestPasswordReset } from "@cocrepo/api/idp/password-reset";
import { ForgotPasswordScreen } from "@cocrepo/ui";
import {
	type IReactionDisposer,
	makeAutoObservable,
	reaction,
	runInAction,
} from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

class ForgotPasswordRoutePageState {
	forgotPasswordForm = {
		email: "",
		errorMessage: null as string | null,
		isSubmitted: false,
		isSubmitting: false,
	};

	private readonly disposeEmailReaction: IReactionDisposer;

	constructor() {
		makeAutoObservable<this, "disposeEmailReaction">(this, {
			disposeEmailReaction: false,
		});

		this.disposeEmailReaction = reaction(
			() => this.forgotPasswordForm.email,
			() => {
				if (this.forgotPasswordForm.errorMessage) {
					this.forgotPasswordForm.errorMessage = null;
				}
			},
		);
	}

	async submit(request: (email: string) => Promise<void>) {
		this.forgotPasswordForm.errorMessage = null;
		this.forgotPasswordForm.isSubmitting = true;

		try {
			await request(this.forgotPasswordForm.email);
			runInAction(() => {
				this.forgotPasswordForm.isSubmitted = true;
			});
		} catch {
			runInAction(() => {
				this.forgotPasswordForm.errorMessage = "서버와 통신할 수 없습니다.";
			});
		} finally {
			runInAction(() => {
				this.forgotPasswordForm.isSubmitting = false;
			});
		}
	}

	destroy() {
		this.disposeEmailReaction();
	}
}

const ForgotPasswordRoutePage = observer(() => {
	const resetMutation = useRequestPasswordReset();
	const forgotPasswordPage = useLocalObservable(
		() => new ForgotPasswordRoutePageState(),
	);

	useEffect(() => {
		return () => {
			forgotPasswordPage.destroy();
		};
	}, [forgotPasswordPage]);

	const onSubmitForgotPasswordForm = async () => {
		await forgotPasswordPage.submit(async (email) => {
			await resetMutation.mutateAsync({
				data: { email },
			});
		});
	};

	return (
		<>
			<ForgotPasswordScreen
				state={forgotPasswordPage}
				onSubmitForgotPasswordForm={onSubmitForgotPasswordForm}
			/>
		</>
	);
});

export default ForgotPasswordRoutePage;
