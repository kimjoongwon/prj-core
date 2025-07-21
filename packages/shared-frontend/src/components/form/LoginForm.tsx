import { EmailInput } from "../inputs/EmailInput";
import { PasswordInput } from "../inputs/PasswordInput";
import { VStack } from "../ui/VStack/VStack";

interface LoginFormProps {
  state: {
    email: string;
    password: string;
  };
}

export const LoginForm = ({ state }: LoginFormProps) => {
  return (
    <VStack fullWidth justifyContent="center">
      <EmailInput path="email" state={state} variant="bordered" />
      <PasswordInput path="password" state={state} variant="bordered" />
    </VStack>
  );
};
