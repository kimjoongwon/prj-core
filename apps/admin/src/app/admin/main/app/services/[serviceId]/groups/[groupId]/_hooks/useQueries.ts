import { useGetGroupSuspense, useGetServiceSuspense } from '@shared/frontend';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { groupId, serviceId } = useParams<{
    groupId: string;
    serviceId: string;
  }>();

  const { data: getServiceResponse } = useGetServiceSuspense(serviceId);
  const { data: getGroupResponse } = useGetGroupSuspense(groupId);

  return {
    service: getServiceResponse.data,
    group: getGroupResponse.data,
  };
};
