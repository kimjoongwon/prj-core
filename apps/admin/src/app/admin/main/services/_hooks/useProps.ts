import { useColumns } from './useColumns';
import { useData } from './useData';
import { useState } from './useState';

export const useProps = () => {
  const state = useState();
  const {
    getAllService: { data: getAllServiceData },
  } = useData();

  const columns = useColumns();

  return {
    state,
    columns,
    data: getAllServiceData.data,
  };
};
