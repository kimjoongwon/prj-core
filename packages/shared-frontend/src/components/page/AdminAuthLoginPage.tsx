import { observer } from "mobx-react-lite";
import { useAdminAuthLoginRoute } from "../../../../../apps/admin/src/hooks/useAdminLoginRoute";
import { Logo } from "../../components/ui/Logo";
import { Text } from "../../components/ui/Text";
import { LoginForm } from "../../components/form/LoginForm";
import { Button } from "../../components/ui/Button";
import { VStack } from "../ui";

export const AdminAuthLoginPage = observer((props: ReturnType<typeof useAdminAuthLoginRoute>) => {
  const { state, handlers } = props;

  return (
    <VStack fullWidth>
      <Logo variants={"text"} />
      <Text variant="h5">관리자 로그인</Text>
      <LoginForm state={state.loginForm} />
      <Button fullWidth type="submit" onPress={handlers.onClickLogin} color="primary">
        로그인
      </Button>
    </VStack>
  );
});
