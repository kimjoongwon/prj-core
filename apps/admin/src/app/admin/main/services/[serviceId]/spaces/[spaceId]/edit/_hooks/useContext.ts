import { useParams } from 'next/navigation';
import { SpaceEditPageParams } from '../page';

export const useContext = () => {
  const { spaceId = 'new', serviceId } = useParams<SpaceEditPageParams>();

  return {
    params: {
      spaceId,
      serviceId,
    },
    isEditMode: spaceId !== 'new',
  };
};
