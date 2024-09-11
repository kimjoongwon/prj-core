import { useParams } from 'next/navigation';

export const useContext = () => {
  return {
    params: useParams<{ spaceId: string; serviceId: string }>(),
  };
};
