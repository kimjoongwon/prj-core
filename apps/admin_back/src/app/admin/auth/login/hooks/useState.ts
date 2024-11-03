import { useLocalObservable } from 'mobx-react-lite';

const defaultLoginFormObject = {
  email: 'galaxy@gmail.com',
  password: 'rkdmf12!@',
};

export const useState = () => {
  return useLocalObservable(() => defaultLoginFormObject);
};
