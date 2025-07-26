import { Button, LoginForm, Logo, Text } from "@shared/frontend";
import { Outlet } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { useAdminAuthLoginRoute } from "../hooks/useAdminLoginRoute";

export const AdminAuthLoginPage = observer((props: ReturnType<typeof useAdminAuthLoginRoute>) => {
  const { state, handlers } = props;

  return (
    <>
      <Logo variants={"text"} />
      <Text variant="h5">관리자 로그인</Text>
      <LoginForm state={state.loginForm} />
      <Button fullWidth type="submit" onPress={handlers.onClickLogin} color="primary">
        로그인
      </Button>
      <Outlet />
    </>
  );
});
