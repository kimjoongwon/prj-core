import { observable } from "mobx";
import { useMutation } from "@tanstack/react-query";
import { getToken } from "@shared/api-client/dist";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";

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

const useHandlers = (props: AdminAuthLoginRouteProps) => {
  const {
    state,
    actions: { login, goToTenantSelect },
  } = props;

  const onClickLogin = async () => {
    try {
      await login(state.loginForm);
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
