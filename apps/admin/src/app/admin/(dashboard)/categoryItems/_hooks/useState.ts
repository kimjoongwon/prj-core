import { useLocalObservable } from 'mobx-react-lite';

export const useState = () => {
  return useLocalObservable(() => ({
    parentIds: ['root'],
    form: {
      name: '',
      parentId: 'root',
    },
  }));
};
