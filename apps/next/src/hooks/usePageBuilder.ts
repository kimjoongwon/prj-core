import { APIManager } from '@shared/frontend';
import { useParams } from 'next/navigation';
import { PageBuilder as IPageBuilder } from '@shared/types';

export const usePageBuilder = (pageName: string, pageKey: string) => {
  const params = useParams();
  const id = params?.[`${pageKey}Id`] as string;
  const type = params.type as 'edit' | 'add' | 'detail';
  // @ts-ignore
  const { data: response } = APIManager[`useGetAdminMain${pageName}`](id, type);
  const pageBuilder = response?.data as IPageBuilder;
  return pageBuilder;
};
