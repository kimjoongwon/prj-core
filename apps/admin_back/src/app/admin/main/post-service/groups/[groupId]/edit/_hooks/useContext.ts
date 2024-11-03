import { useParams } from 'next/navigation';

export const useContext = () => {
  const { groupId = 'new', serviceId } = useParams<{
    groupId: string;
    serviceId: string;
  }>();
  return {
    groupId,
    serviceId,
    isEditMode: groupId !== 'new',
  };
};
