import { useParams } from 'next/navigation';

export const useContext = () => {
  return {
    params: useParams<{ timelineItemId: string; serviceId: string }>(),
  };
};
