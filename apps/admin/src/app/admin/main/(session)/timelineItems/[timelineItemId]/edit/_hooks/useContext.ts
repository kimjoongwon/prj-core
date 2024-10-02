import { useParams } from 'next/navigation';

export const useContext = () => {
  const { timelineItemId = 'new', serviceId } = useParams<{
    timelineItemId: string;
    serviceId: string;
  }>();

  return {
    params: {
      timelineItemId,
      serviceId,
    },
    isEditMode: timelineItemId !== 'new',
  };
};
