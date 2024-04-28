'use client';

import { ButtonProps } from '@nextui-org/react';
import {
  CategoryDto,
  CategoryForm,
  CreateCategoryDto,
  FormLayout,
  useCreateCategory,
  useGetCategoryById,
  useUpdateCategory,
} from '@shared/frontend';
import { router } from '@shared/frontend';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { categoriesPage } from '../../_state';

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

  const { categoryId } = useParams<{ categoryId: string }>();
  const isEditMode = categoryId !== 'new';

  const createCategoryDto: CreateCategoryDto = {
    ancestorIds: [],
    name: '',
    parentId: null,
    serviceId: '',
    spaceId: '',
  };

  const state = observable<{
    category: CategoryDto | undefined | CreateCategoryDto;
  }>({
    category: isEditMode ? category : createCategoryDto,
  });

  return state;
};

const useQueries = () => {
  const { categoryId, serviceId } = useParams<{
    categoryId: string;
    serviceId: string;
  }>();

  const { data: queryData } = useGetCategoryById(categoryId, {
    query: {
      enabled: categoryId !== 'new',
    },
  });
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { mutateAsync: createCategory } = useCreateCategory();

  return {
    createCategory,
    updateCategory,
    category: queryData?.data,
  };
};

const useHandlers = (props: {
  queries: ReturnType<typeof useQueries>;
  state: ReturnType<typeof useState>;
}) => {
  const {
    queries: { updateCategory, createCategory },
  } = props;

  const { categoryId } = useParams<{
    categoryId: string;
    serviceId: string;
  }>();

  const isEditMode = categoryId !== 'new';

  const onClickSave = async () => {
    const parentCategory = categoriesPage.state.openedCategory.name;

    // let createCategoryDto = {
    //   ...parentCategory,
    // } as CreateCategoryDto;

    // if (parentCategory) {
    //   createCategoryDto?.ancestorIds
    //     ?.concat(parentCategory.ancestorIds)
    //     ?.concat([parentCategory.id]);
    // }

    // if (isEditMode) {
    //   await updateCategory({
    //     categoryId,
    //     data: state.category!,
    //   });
    //   return;
    // }

    // await createCategory({
    //   data: createCategoryDto,
    // });
  };

  const onClickCancel = () => router.back();

  return {
    onClickSave,
    onClickCancel,
  };
};
