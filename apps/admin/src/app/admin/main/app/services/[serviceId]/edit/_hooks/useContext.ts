import { useParams } from 'next/navigation';
import { ServiceEditPageParams } from '../page';

export const useContext = () => {
  const { serviceId = 'new' } = useParams<ServiceEditPageParams>();

  return {
    serviceId,
    isEditMode: serviceId !== 'new',
  };
};
