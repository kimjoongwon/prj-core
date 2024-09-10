import { CreateSessionDto, UpdateSessionDto } from '../../../../model';
import { useLocalObservable } from 'mobx-react-lite';

export const oneTimeDefaultObject = {
  date: new Date().toISOString(),
  startDete: new Date().toISOString(),
  endDate: new Date().toISOString(),
};

export const useState = ({
  state,
}: {
  state: CreateSessionDto | UpdateSessionDto;
}) => {
  return useLocalObservable(() => ({
    ...state,
    rangeMode: false,
    oneTime: oneTimeDefaultObject,
  }));
};
