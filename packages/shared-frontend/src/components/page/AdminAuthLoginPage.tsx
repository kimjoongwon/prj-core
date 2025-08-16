
import { useAdminAuthLoginRoute } from "../../../../../apps/admin/src/hooks/useAdminLoginRoute";
import { LoginForm } from "../form/LoginForm/LoginForm";
import { VStack } from "../ui";
import { Button } from "../ui/Button/Button";
import { Logo } from "../ui/Logo/Logo";
import { Text } from "../ui/Text/Text";

export const AdminAuthLoginPage = (
	(props: ReturnType<typeof useAdminAuthLoginRoute>) => {
		const { state, handlers } = props;

		return (
			<VStack fullWidth>
				<Logo />
				<Text variant="h5">관리자 로그인</Text>
				<LoginForm state={state.loginForm} />
				<Button
					fullWidth
					type="submit"
					onPress={handlers.onClickLogin}
					color="primary"
				>
					로그인
				</Button>
			</VStack>
		);
	}
);
