import { $Enums } from "@shared/schema";
import { DataGridBuilderProps, IButtonBuilder, PageBuilder } from "@shared/types";

export const getGroupsPage = (type: $Enums.GroupTypes): PageBuilder => {
  return {
    name: "그룹 리스트",
    elements: [
      {
        name: "DataGridBuilder",
        props: {
          buttons: [
            {
              children: "그룹 생성",
              variant: "solid",
              color: "primary",
              size: "md",
              radius: "lg",
              startContent: "plus-circle",
              className:
                "font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200",
              navigator: {
                type: "push",
                route: {
                  relativePath: ":id/create",
                  params: {
                    id: "new",
                  },
                },
              },
            },
          ],
          table: {
            type: "table" as const,
            query: {
              name: "useGetGroupsByQuery",
              params: {
                skip: 0,
                take: 10,
                type,
              },
            },
            pagination: {
              enabled: true,
              defaultTake: 10,
            },
            columns: [
              {
                accessorKey: "name",
                header: {
                  name: "이름",
                },
              },
              {
                accessorKey: "label",
                header: {
                  name: "라벨",
                },
              },
              {
                accessorKey: "actions",
                header: {
                  name: "액션",
                },
                cell: {
                  type: "row-actions",
                  buttons: [
                    {
                      children: "상세",
                      variant: "light",
                      size: "sm",
                      color: "primary",
                      radius: "sm",
                      isIconOnly: false,
                      startContent: "eye",
                      className: "min-w-unit-14 text-xs px-2 py-1",
                      navigator: {
                        type: "push",
                        route: {
                          name: "그라운드 그룹 디테일",
                          relativePath: ":groupId/detail",
                          pathParams: {
                            groupId: "selectedRow.id",
                          },
                        },
                      },
                    } satisfies IButtonBuilder,
                    {
                      children: "수정",
                      variant: "light",
                      size: "sm",
                      color: "warning",
                      radius: "sm",
                      isIconOnly: false,
                      startContent: "edit",
                      className: "min-w-unit-14 text-xs px-2 py-1",
                      navigator: {
                        type: "push",
                        route: {
                          relativePath: ":groupId/modify",
                          pathParams: {
                            groupId: "selectedRow.id",
                          },
                        },
                      },
                    } satisfies IButtonBuilder,
                    {
                      children: "삭제",
                      variant: "light",
                      size: "sm",
                      color: "danger",
                      radius: "sm",
                      isIconOnly: false,
                      startContent: "trash",
                      className: "min-w-unit-14 text-xs px-2 py-1",
                      mutation: {
                        name: "deleteGroupById",
                        pathParams: {
                          groupId: "selectedRow.id", // pageState.selectedRow.id에서 ID를 가져옴
                        },
                        queryKey: "/api/v1/groups",
                      },
                    } satisfies IButtonBuilder,
                  ],
                },
              },
            ],
          },
        } satisfies DataGridBuilderProps,
      },
    ],
  };
};
