import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Button, LoginForm } from "@shared/frontend";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";

export const loginRouteState = observable(
  {
    loginForm: {
      password: "",
      email: "",
    },
  },
  {},
  { proxy: true },
);

const LoginRouteComponent = observer(() => {
  return (
    <>
      <LoginForm state={loginRouteState.loginForm} />
      <Button fullWidth type="submit">
        로그인
      </Button>
      <Outlet />
    </>
  );
});

export const Route = createFileRoute("/admin/auth/login")({
  component: LoginRouteComponent,
});
