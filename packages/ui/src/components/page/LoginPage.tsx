import { LoginForm } from "../form/LoginForm/LoginForm";
import { Logo } from "../ui/data-display/Logo/Logo";
import { Text } from "../ui/data-display/Text/Text";
import { Button } from "../ui/inputs/Button/Button";
import { VStack } from "../ui/surfaces/VStack/VStack";

export const LoginPage = (props: any) => {
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
};
