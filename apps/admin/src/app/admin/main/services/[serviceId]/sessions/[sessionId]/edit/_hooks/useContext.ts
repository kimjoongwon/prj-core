import { useParams } from 'next/navigation';

export const useContext = () => {
  const { sessionId = 'new', serviceId } = useParams<{
    sessionId: string;
    serviceId: string;
  }>();

  return {
    params: {
      sessionId,
      serviceId,
    },
    isEditMode: sessionId !== 'new',
  };
};
