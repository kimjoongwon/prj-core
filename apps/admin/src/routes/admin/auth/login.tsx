import { login } from "@cocrepo/api-client";
import { AdminAuthLoginPage } from "@cocrepo/ui";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";

export interface AdminAuthLoginRouteProps {
  state: ReturnType<typeof useState>;
  actions: ReturnType<typeof useActions>;
}

const useState = () => {
  return observable({
    loginForm: {
      email: "plate@gmail.com",
      password: "rkdmf12!@",
    },
  });
};

const useActions = () => {
  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: login,
  });

  const navigate = useNavigate();

  const goToTenantSelect = () => {
    navigate({
      to: "/admin/auth/login/tenant-select",
    });
  };

  return {
    goToTenantSelect,
    loginMutation,
  };
};

const useHandlers = (props: AdminAuthLoginRouteProps) => {
  const {
    state,
    actions: { loginMutation, goToTenantSelect },
  } = props;

  const onClickLogin = async () => {
    try {
      await loginMutation(state.loginForm);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message);
      }
    }

    goToTenantSelect();
  };

  return {
    onClickLogin,
  };
};

export const useAdminAuthLoginRoute = () => {
  const state = useState();
  const actions = useActions();
  const handlers = useHandlers({
    state,
    actions,
  });

  return {
    state,
    actions,
    handlers,
  };
};

const LoginRouteComponent = observer(() => {
  const route = useAdminAuthLoginRoute();

  return <AdminAuthLoginPage {...route} />;
});

export const Route = createFileRoute("/admin/auth/login")({
  component: LoginRouteComponent,
});
