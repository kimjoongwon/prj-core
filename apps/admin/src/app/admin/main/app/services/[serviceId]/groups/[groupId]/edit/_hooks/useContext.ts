import { useParams } from 'next/navigation';

export const useContext = () => {
  const { groupId = 'new' } = useParams<{ groupId: string }>();
  return {
    groupId,
    isEditMode: groupId !== 'new',
  };
};
