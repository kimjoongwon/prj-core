import { useState } from './useState';
import { useMutations } from './useMutations';
import {
  Button,
  CreateClassificationDto,
  galaxy,
  ServiceItemModalBody,
  SpaceDto,
} from '@shared/frontend';
import { useParams } from 'next/navigation';
import { useQueries } from './useQueries';
import { toast } from 'react-toastify';

export const useHandlers = (context: {
  state: ReturnType<typeof useState>;
  mutations: ReturnType<typeof useMutations>;
  queries: ReturnType<typeof useQueries>;
}) => {
  const {
    state,
    mutations: { deleteClassifications, createClassifications },
    queries: { spaces, spacesTotalCount, refetchClassifications },
  } = context;
  const { categoryId, serviceId } = useParams<{
    serviceId: string;
    categoryId: string;
  }>();

  // '목록' 버튼 클릭 시
  const onClickList = () => {
    galaxy.router.back();
  };

  // '수정' 버튼 클릭 시
  const onClickEdit = () => {
    galaxy.router.push({
      url: '/admin/main/app/services/:serviceId/categories/:categoryId/edit',
      params: {
        serviceId,
        categoryId,
      },
    });
  };
  // '삭제' 버튼 클릭 시
  const onClickDeleteClassification = () => {
    deleteClassifications.mutate({
      classificationId: state.classificationsTable.selectedKeys?.[0],
    });
  };

  // '추가' 버튼 클릭 시
  const onClickAdd = () => {
    const items: CreateClassificationDto[] = state.spacesTable.selectedKeys.map(
      spaceId => ({
        serviceItemId: spaceId,
        serviceId,
        categoryId,
      }),
    );

    createClassifications.mutate(
      {
        data: { items },
      },
      {
        onSuccess: () => {
          refetchClassifications();
          galaxy.modal.destory();
          toast.success('카테고리 할당이 완료되었습니다.');
        },
        onError: () => {
          toast.error('카테고리 할당에 실패했습니다.');
          alert('error');
        },
      },
    );
  };

  // '카테고리 할당' 버튼 클릭 시
  const onClickCategoryAssignments = () => {
    galaxy.modal.build({
      header: '카테고리 할당',
      body: (
        <ServiceItemModalBody
          hideHeader
          hideButtons
          // items={spaces as SpaceDto[]}
          state={state.spacesTable}
          type={'user'}
          totalCount={spacesTotalCount || 0}
        />
      ),
      footer: (
        <Button color="primary" onClick={onClickAdd}>
          추가
        </Button>
      ),
    });
  };

  return {
    onClickList,
    onClickEdit,
    onClickCategoryAssignments,
    onClickDeleteClassification,
    onClickAdd,
  };
};
