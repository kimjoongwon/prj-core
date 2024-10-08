import {
  useGetGroupSuspense,
  useGetServiceSuspense,
  useGetSpacesByQuerySuspense,
  useGetUsersByQuerySuspense,
} from '@shared/frontend';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { groupId, serviceId } = useParams<{
    groupId: string;
    serviceId: string;
  }>();

  const { data: getServiceResponse } = useGetServiceSuspense(serviceId);
  const { data: getGroupResponse } = useGetGroupSuspense(groupId);
  const { data: getUsersResponse } = useGetUsersByQuerySuspense();
  const { data: getSpacesResponse } = useGetSpacesByQuerySuspense();

  return {
    service: getServiceResponse.data,
    group: getGroupResponse.data,
    users: getUsersResponse.data || [],
    spaces: getSpacesResponse.data || [],
  };
};
