import { CreateUserInput, UpdateUserInput } from '@__generated__/graphql';

export const useDefaultObjects = () => {
  const userDefaultObject: CreateUserInput = {
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
