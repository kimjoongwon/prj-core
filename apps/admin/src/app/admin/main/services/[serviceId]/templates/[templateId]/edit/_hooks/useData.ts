import {
  useCreateTemplate,
  useGetTemplate,
  useUpdateTemplate,
} from '@shared/frontend';
import { useContext } from './useContext';

export const useData = (props: { context: ReturnType<typeof useContext> }) => {
  const {
    context: {
      params: { templateId },
      isEditMode,
    },
  } = props;

  const getTemplate = useGetTemplate(templateId, {
    query: {
      enabled: isEditMode,
    },
  });

  return {
    getTemplate: getTemplate,
    createTemplate: useCreateTemplate(),
    updateTemplate: useUpdateTemplate(),
  };
};
