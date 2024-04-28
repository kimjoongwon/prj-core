import { isEmpty } from 'lodash-es';

export const getErrorMessage = () => {};

export const isObjectEmpty = (params: object | undefined) => {
  if (isEmpty(params)) {
    return true;
  }

  const isObjectEmpty = !!(Object.values(params)?.[0] === undefined);

  return isObjectEmpty;
};
