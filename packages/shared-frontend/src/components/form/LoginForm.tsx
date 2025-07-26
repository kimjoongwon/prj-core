import { useNavigator } from "src/provider";
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
  const _navigator = useNavigator();
  return (
    <VStack fullWidth justifyContent="center">
      <EmailInput path="email" state={state} variant="flat" />
      <PasswordInput path="password" state={state} variant="flat" />
    </VStack>
  );
};
