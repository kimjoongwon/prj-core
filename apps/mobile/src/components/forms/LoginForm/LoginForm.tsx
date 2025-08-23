import React from "react";
import { StyleSheet } from "react-native";
import { Input } from "@/components/forms/Input";
import { Card } from "@/components/ui/Card/Card";

export interface LoginFormState {
	email: string;
	password: string;
}

export interface LoginFormProps {
	state: LoginFormState;
}

export const LoginForm: React.FC<LoginFormProps> = ({ state }) => {
	return (
		<Card style={styles.container}>
			<Input
				state={state}
				path="email"
				label="이메일"
				placeholder="이메일을 입력하세요"
				keyboardType="email-address"
				autoCapitalize="none"
				autoComplete="email"
			/>

			<Input
				state={state}
				path="password"
				label="비밀번호"
				placeholder="비밀번호를 입력하세요"
				secureTextEntry
				autoComplete="password"
			/>
		</Card>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 16,
		width: "100%",
	},
});

export default LoginForm;
