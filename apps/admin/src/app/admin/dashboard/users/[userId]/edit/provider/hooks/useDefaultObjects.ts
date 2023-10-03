import { SignupInput } from '@__generated__/graphql';

export const useDefaultObjects = () => {
  const userDefaultObject: SignupInput = {
    email: '',
    password: '',
    profile: {
      nickname: '',
      phone: '',
    },
  };

  return {
    userDefaultObject,
  };
};
