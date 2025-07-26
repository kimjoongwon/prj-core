import { useNavigate } from "@tanstack/react-router";
import { observable } from "mobx";

export const useAdminAuthTenantSelectRoute = () => {
  const state = useState();
  useNavigate();
  const handlers = useHandlers();
  return {
    state,
    handlers,
  };
};

const useState = () => {
  return observable({
    listbox: { selectedTenantId: "" },
  });
};

const useHandlers = () => {
  const onClickSelect = () => {};

  return {
    onClickSelect,
  };
};
