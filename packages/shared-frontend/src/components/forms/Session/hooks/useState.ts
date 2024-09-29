import { CreateSessionDto, UpdateSessionDto } from '../../../../model';
import { useLocalObservable } from 'mobx-react-lite';
import { SessionFormProps } from '../types';

export const oneTimeDefaultObject = {
  date: new Date().toISOString(),
  startDete: new Date().toISOString(),
  endDate: new Date().toISOString(),
};

export const useState = ({ state }: { state: SessionFormProps['state'] }) => {
  return useLocalObservable(() => ({
    ...state,
    rangeMode: false,
    oneTime: oneTimeDefaultObject,
  }));
};
