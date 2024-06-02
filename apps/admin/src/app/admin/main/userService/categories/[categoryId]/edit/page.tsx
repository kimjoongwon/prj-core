'use client';

import { ButtonProps } from '@nextui-org/react';
import {
  CategoryDto,
  CategoryForm,
  CreateCategoryDto,ß
  FormLayout,
  myUniv,
  useCreateCategory,
  useFindCategoryById,
  useGetAllService,
  useUpdateCategory,
} from '@shared/frontend';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { categroiesPageState } from '../../_hooks/state';
import { isEmpty } from 'lodash-es';
import { Path } from 'path-parser';

const CategoryDetailPage = observer(() => {
  const {
    state,
    handlers: { onClickCancel, onClickSave },
  } = useCategoryPage();

  const leftButtons: ButtonProps[] = [
    {
      onClick: onClickCancel,
      children: '취소',
    },
  ];

  const rightButtons: ButtonProps[] = [
    {
      children: '저장',
      onClick: onClickSave,
    },
  ];

  return (
    <FormLayout
      title="카테고리"
      leftButtons={leftButtons}
      rightButtons={rightButtons}
    >
      <CategoryForm type="create" state={state.category!} />
    </FormLayout>
  );
});

export default CategoryDetailPage;

export const useCategoryPage = () => {
  const queries = useQueries();
  const state = useState(queries);
  const handlers = useHandlers({ queries, state });

  return {
    state,
    handlers,
  };
};

const useState = (props: ReturnType<typeof useQueries>) => {
  const { category } = props;

  return useLocalObservable<{
    category: CategoryDto | undefined | CreateCategoryDto;
  }>(() => ({
    category: category,
  }));
};

const useQueries = () => {
  const { categoryId } = useParams<{
    categoryId: string;
  }>();

  const isEditMode = categoryId !== 'new';

  const { data: findCategoryByIdQueryData } = useFindCategoryById(categoryId, {
    query: {
      enabled: categoryId !== 'new',
    },
  });

  const category = findCategoryByIdQueryData?.data;

  const { mutateAsync: updateCategory } = useUpdateCategory();

  const { mutateAsync: createCategory } = useCreateCategory();

  return {
    createCategory,
    updateCategory,
    category: isEditMode
      ? category
      : {
          ancestorIds: [],
          name: '',
          parentId: null,
          serviceId: '',
          spaceId: '',
        },
  };
};

const useHandlers = (props: {
  queries: ReturnType<typeof useQueries>;
  state: ReturnType<typeof useState>;
}) => {
  const {
    state,
    queries: { updateCategory, createCategory },
  } = props;

  const { categoryId } = useParams<{
    categoryId: string;
    serviceId: string;
  }>();

  const { data: services } = useGetAllService();

  const isEditMode = categoryId !== 'new';

  const onClickSave = async () => {
    const openedCategory = categroiesPageState.openedCategory;
    const userService = services?.find(service => service.name === 'USER');

    if (isEditMode) {
      await updateCategory({
        categoryId,
        data: state.category!,
      });
      return;
    }
    try {
      await createCategory({
        data: {
          name: state.category?.name || '',
          ancestorIds: isEmpty(openedCategory?.ancestorIds)
            ? openedCategory.id
              ? [openedCategory.id]
              : []
            : [...openedCategory?.ancestorIds, openedCategory.id],
          parentId: openedCategory.id || null,
          serviceId: userService?.id!,
          spaceId: myUniv?.auth.currentSpaceId!,
        },
      });

      categroiesPageState.openedCategory = {} as CategoryDto;
    } catch (error) {
      console.error(error);
    }

    myUniv?.router.back();
  };

  const onClickCancel = () => {
    myUniv?.router.back();
  };

  return {
    onClickSave,
    onClickCancel,
  };
};
