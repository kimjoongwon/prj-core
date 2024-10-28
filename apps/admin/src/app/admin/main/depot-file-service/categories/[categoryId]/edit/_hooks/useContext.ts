import { useParams } from 'next/navigation';

export const useContext = () => {
  const { categoryId = 'new' } = useParams<{ categoryId: string }>();
  const isEditMode = categoryId !== 'new';

  return {
    categoryId,
    isEditMode,
  };
};
