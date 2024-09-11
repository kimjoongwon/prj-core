import { useParams } from 'next/navigation';

export const useContext = () => {
  return {
    params: useParams<{ sessionId: string; serviceId: string }>(),
  };
};
