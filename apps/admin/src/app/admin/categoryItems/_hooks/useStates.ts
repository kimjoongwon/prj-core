import { useLocalObservable } from 'mobx-react-lite';

type State = {
  parentIds: Set<string | null>;
  selectedParentId: string | null;
  form: {
    name: string;
    parentId: string | null;
  };
};

export const useStates = () => {
  return useLocalObservable<State>(() => ({
    parentIds: new Set<string | null>().add(null),
    selectedParentId: null,
    form: {
      name: '',
      parentId: null,
    },
  }));
};
