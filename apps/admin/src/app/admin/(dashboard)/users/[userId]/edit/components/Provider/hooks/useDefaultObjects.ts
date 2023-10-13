export const useDefaultObjects = () => {
  const userDefaultObject = {
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
