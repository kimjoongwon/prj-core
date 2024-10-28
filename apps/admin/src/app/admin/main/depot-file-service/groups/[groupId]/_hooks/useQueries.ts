import {
  useCreateAssignments,
  useGetAssignmentsByQuery,
  useGetAssignmentsByQuerySuspense,
  useGetGroup,
  useGetService,
  useGetSpacesByQuery,
  useGetSpacesByQuerySuspense,
  useGetUsersByQuery,
} from '@shared/frontend';
import { useParams } from 'next/navigation';
import { useQueries as _useQueries } from '@tanstack/react-query';

export const useQueries = () => {
  const { groupId, serviceId } = useParams<{
    groupId: string;
    serviceId: string;
  }>();

  const { data: getServiceResponse, isLoading: isGetServiceLoading } =
    useGetService(serviceId);
  const { data: getGroupResponse, isLoading: isGetGroupLoading } =
    useGetGroup(groupId);
  const { data: getUsersResponse, isLoading: isGetUsersByQueryLoading } =
    useGetUsersByQuery();
  const { data: getSpacesResponse, isLoading: isGetSpacesByQueryLoading } =
    useGetSpacesByQuery();
  const {
    data: getAssignmentsResponse,
    isLoading: isGetAssignmentsByQueryLoading,
  } = useGetAssignmentsByQuery();
  const { mutate: createAssignments } = useCreateAssignments();

  return {
    isLoading:
      isGetServiceLoading ||
      isGetGroupLoading ||
      isGetUsersByQueryLoading ||
      isGetSpacesByQueryLoading ||
      isGetAssignmentsByQueryLoading,
    service: getServiceResponse?.data,
    group: getGroupResponse?.data,
    users: getUsersResponse?.data || [],
    spaces: getSpacesResponse?.data || [],
    assignments: getAssignmentsResponse?.data || [],
    createAssignments,
  };
};
