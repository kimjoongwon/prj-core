export const useHandlers = () => {
  const onClickCreate = () => {
    console.log('onClickCreate');
  };
  const onClickRemove = () => {
    console.log('onClickRemove');
  };

  return {
    onClickCreate,
    onClickRemove,
  };
};
