import { RouteBuilder } from "@shared/types";
import { groupEditLayout } from "../layouts/group-edit.layout";

export const groupEditRoute: RouteBuilder = {
  name: '그룹 수정',
  pathname: ':groupId/edit',
  layout: groupEditLayout,
};
