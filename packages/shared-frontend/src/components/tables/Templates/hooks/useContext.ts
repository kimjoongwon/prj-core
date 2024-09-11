import { useParams } from 'next/navigation';

export const useContext = () => {
  return {
    params: useParams<{ templateId: string; serviceId: string }>(),
  };
};
