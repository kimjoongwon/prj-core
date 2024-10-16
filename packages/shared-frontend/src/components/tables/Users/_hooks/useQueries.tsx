import { UsersTableProps } from '..';
import { useGetUsersByQuerySuspense } from '../../../../apis';

export const useQueries = ({ props }: { props: UsersTableProps }) => {
  const { standalone = false } = props;
  const { data: useGetUsersByQuery } = standalone
    ? useGetUsersByQuerySuspense(props?.state?.query)
    : null;
  return {
    users: useGetUsersByQuery.data,
  };
};
