import { useParams } from 'next/navigation';

export const useContext = () => {
  const { templateId = 'new', serviceId } = useParams<{
    templateId: string;
    serviceId: string;
  }>();

  return {
    params: {
      templateId,
      serviceId,
    },
    isEditMode: templateId !== 'new',
  };
};
