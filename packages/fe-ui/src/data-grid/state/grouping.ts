import type { Row } from "@tanstack/react-table";
import type { Key } from "../Table/rowKeys";

export const DATA_GRID_GROUP_BY_QUERY_KEY = "groupBy";

export type DataGridBodyRow<T extends { id: Key }> = Row<T>;
