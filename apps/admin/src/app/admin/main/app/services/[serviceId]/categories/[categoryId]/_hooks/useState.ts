import {
  DataGridState,
  GetClassificationsByQueryParams,
  GetSpacesByQueryParams,
} from '@shared/frontend';
import { useLocalObservable } from 'mobx-react-lite';

export const useState = () => {
  const spaceQuery: GetSpacesByQueryParams & DataGridState = {};
  const classificationQuery: GetClassificationsByQueryParams & DataGridState =
    {};

  const state = useLocalObservable<{
    spacesTable: {
      selectedKeys: string[];
      query: GetSpacesByQueryParams;
    };
    classificationsTable: {
      selectedKeys: string[];
      query: GetClassificationsByQueryParams;
    };
  }>(() => ({
    spacesTable: {
      selectedKeys: [],
      query: spaceQuery,
    },
    classificationsTable: {
      selectedKeys: [],
      query: classificationQuery,
    },
  }));

  return state;
};
