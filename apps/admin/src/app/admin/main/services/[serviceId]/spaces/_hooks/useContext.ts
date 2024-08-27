import { useParams } from 'next/navigation';
import { SpacesPageParams } from '../layout';

export const useContext = () => {
  return {
    params: useParams<SpacesPageParams>(),
  };
};
