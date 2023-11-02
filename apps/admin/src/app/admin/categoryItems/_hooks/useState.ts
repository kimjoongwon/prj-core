import { useLocalObservable } from 'mobx-react-lite';

type State = {
  parentIds: Set<string | null>;
  currentSelectedParentId: string | null;
  form: {
    name: string;
    parentId: string | null;
  };
};

export const useState = () => {
  return useLocalObservable<State>(() => ({
    parentIds: new Set<string | null>().add(''),
    currentSelectedParentId: null,
    form: {
      name: '',
      parentId: null,
    },
  }));
};
