import { VStack } from "../../ui/VStack/VStack";
import { Input } from "../../inputs/Input/Input";

interface LoginFormProps {
	state: {
		email: string;
		password: string;
	};
}

export const LoginForm = ({ state }: LoginFormProps) => {
	return (
		<VStack fullWidth justifyContent="center">
			<Input
				path="email"
				state={state}
				variant="flat"
				type="email"
				placeholder="Enter your email"
				label="Email"
			/>
			<Input
				path="password"
				state={state}
				variant="flat"
				type="password"
				placeholder="Enter your password"
				label="Password"
			/>
		</VStack>
	);
};
