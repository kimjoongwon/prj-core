import React from "react";
import { View, StyleSheet } from "react-native";
import { Input } from "../Input";

export interface LoginFormState {
  email: string;
  password: string;
}

export interface LoginFormProps {
  state: LoginFormState;
}

export const LoginForm: React.FC<LoginFormProps> = ({ state }) => {
  return (
    <View style={styles.container}>
      <Input
        state={state}
        path="email"
        label="이메일"
        placeholder="이메일을 입력하세요"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        variant="bordered"
        size="lg"
        style={styles.input}
      />

      <Input
        state={state}
        path="password"
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        secureTextEntry
        autoComplete="password"
        variant="bordered"
        size="lg"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  input: {
    marginBottom: 8,
  },
});

export default LoginForm;
