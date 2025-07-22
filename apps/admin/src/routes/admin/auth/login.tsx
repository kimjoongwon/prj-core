import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Button, LoginForm } from "@shared/frontend";
import { observer } from "mobx-react-lite";
import { observable } from "mobx";
import { useMutation } from "@tanstack/react-query";
import { getToken } from "@shared/api-client/dist";

const LoginRouteComponent = observer(() => {
  const state = useState();
  const { onClickLogin } = useHandler();

  return (
    <>
      <LoginForm state={state.loginForm} />
      <Button fullWidth type="submit" onClick={onClickLogin}>
        로그인
      </Button>
      <Outlet />
    </>
  );
});

export const Route = createFileRoute("/admin/auth/login")({
  component: LoginRouteComponent,
});

interface Props {
  state: ReturnType<typeof useState>;
  actions: ReturnType<typeof useActions>;
}

const useState = () => {
  return observable({
    loginForm: {
      email: "",
      password: "",
    },
  });
};

const useActions = () => {
  const { mutateAsync: login } = useMutation({
    mutationFn: getToken,
  });

  const navigate = useNavigate();

  const goToTenantSelect = () => {
    navigate({
      to: "/admin/auth/login/tenant-select",
    });
  };

  return {
    goToTenantSelect,
    login,
  };
};

const useHandler = (props: Props) => {
  const {
    state,
    actions: { login, goToTenantSelect },
  } = props;

  const onClickLogin = async () => {
    try {
      await login(state.loginForm);
    } catch (error: unknown) {
      throw new Error("");
    }

    goToTenantSelect();
  };

  return {
    onClickLogin,
  };
};
