import { useLocalObservable } from 'mobx-react-lite';

export const useState = () => {
  return useLocalObservable(() => ({
    parentIds: new Set().add('root'),
    currentSelectedParentId: 'root',
    form: {
      name: '',
      parentId: 'root',
    },
  }));
};
