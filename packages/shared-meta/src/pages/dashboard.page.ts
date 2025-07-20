import { PageBuilder } from "@shared/types";

export const getDashboardPage = (): PageBuilder => {
  return {
    name: "대시보드",
    elements: [
      {
        name: "VStack",
        props: {
          className: "space-y-4",
        },
        children: [
          {
            name: "Spacer",
            props: {
              size: "4",
            },
          },
          {
            name: "Text",
            props: {
              children: "대시보드에 오신 것을 환영합니다!",
              variant: "h1",
              className: "text-center text-2xl font-bold text-gray-800",
            },
          },
          {
            name: "Spacer",
            props: {
              size: "2",
            },
          },
          {
            name: "Text",
            props: {
              children: "워크스페이스가 성공적으로 선택되었습니다.",
              variant: "body1",
              className: "text-center text-gray-600",
            },
          },
          {
            name: "Spacer",
            props: {
              size: "4",
            },
          },
        ],
      },
    ],
  };
};
