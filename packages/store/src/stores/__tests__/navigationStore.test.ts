/// <reference types="vitest/globals" />

import type { RouteDto } from "@cocrepo/api-client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NavigationStore } from "../navigationStore";
import { NavigatorStore } from "../navigatorStore";
import { PlateStore } from "../plateStore";

// 의존성 모킹
vi.mock("../plateStore");
vi.mock("../navigatorStore");

describe("NavigationStore", () => {
  let plateStore: PlateStore;
  let navigatorStore: NavigatorStore;
  let navigationStore: NavigationStore;

  const mockRoutes: RouteDto[] = [
    {
      name: "Dashboard",
      fullPath: "/dashboard",
      relativePath: "/dashboard",
      icon: "dashboard",
      children: [
        {
          name: "Analytics",
          fullPath: "/dashboard/analytics",
          relativePath: "/analytics",
          icon: "chart",
          children: null,
        },
        {
          name: "Reports",
          fullPath: "/dashboard/reports",
          relativePath: "/reports",
          icon: "report",
          children: null,
        },
      ],
    },
    {
      name: "Users",
      fullPath: "/users",
      relativePath: "/users",
      icon: "users",
      children: [
        {
          name: "List",
          fullPath: "/users/list",
          relativePath: "/list",
          icon: "list",
          children: null,
        },
      ],
    },
    {
      name: "Settings",
      fullPath: "/settings",
      relativePath: "/settings",
      icon: "settings",
      children: null,
    },
  ];

  beforeEach(() => {
    plateStore = {} as PlateStore;
    navigatorStore = new NavigatorStore(plateStore);

    // window.location 모킹
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/",
      },
      writable: true,
    });

    // navigatorStore 메서드 모킹
    vi.spyOn(navigatorStore, "getRouteByFullPath").mockReturnValue(undefined);
  });

  describe("생성자", () => {
    it("routeDtos가 제공되지 않을 때 빈 경로로 초기화되어야 함", () => {
      navigationStore = new NavigationStore(plateStore, navigatorStore);

      expect(navigationStore.routes).toHaveLength(0);
      expect(navigationStore.currentRoute).toBeUndefined();
    });

    it("routeDtos로부터 경로가 초기화되어야 함", () => {
      navigationStore = new NavigationStore(
        plateStore,
        navigatorStore,
        mockRoutes
      );

      expect(navigationStore.routes).toHaveLength(3);
      expect(navigationStore.routes[0].name).toBe("Dashboard");
      expect(navigationStore.routes[0].children).toHaveLength(2);
    });

    it("window location으로부터 초기 현재 경로가 설정되어야 함", () => {
      const mockRoute: RouteDto = {
        name: "Dashboard",
        fullPath: "/dashboard",
        relativePath: "/dashboard",
        icon: "dashboard",
        children: null,
      };

      window.location.pathname = "/dashboard";
      vi.spyOn(navigatorStore, "getRouteByFullPath").mockReturnValue(mockRoute);

      navigationStore = new NavigationStore(
        plateStore,
        navigatorStore,
        mockRoutes
      );

      expect(navigationStore.currentRoute).toEqual(mockRoute);
    });
  });

  describe("currentRoute setter와 getter", () => {
    beforeEach(() => {
      navigationStore = new NavigationStore(
        plateStore,
        navigatorStore,
        mockRoutes
      );
    });

    it("currentRoute를 업데이트하고 활성 상태 업데이트를 트리거해야 함", () => {
      const newRoute: RouteDto = {
        name: "Dashboard",
        fullPath: "/dashboard",
        relativePath: "/dashboard",
        icon: "dashboard",
        children: null,
      };

      navigationStore.currentRoute = newRoute;

      expect(navigationStore.currentRoute).toEqual(newRoute);
    });

    it("같은 경로를 설정할 때 업데이트를 트리거하지 않아야 함", () => {
      const route: RouteDto = {
        name: "Dashboard",
        fullPath: "/dashboard",
        relativePath: "/dashboard",
        icon: "dashboard",
        children: null,
      };

      navigationStore.currentRoute = route;
      const firstRoute = navigationStore.currentRoute;

      navigationStore.currentRoute = route;

      expect(navigationStore.currentRoute).toStrictEqual(firstRoute);
    });
  });

  describe("활성 상태 관리", () => {
    beforeEach(() => {
      navigationStore = new NavigationStore(
        plateStore,
        navigatorStore,
        mockRoutes
      );
    });

    it("현재 경로가 없을 때 모든 활성 상태를 재설정해야 함", () => {
      // 먼저 경로를 설정해서 활성 상태로 만들기
      const route: RouteDto = {
        name: "Dashboard",
        fullPath: "/dashboard",
        relativePath: "/dashboard",
        icon: "dashboard",
        children: null,
      };
      navigationStore.currentRoute = route;

      // 현재 경로를 undefined로 설정
      navigationStore.currentRoute = undefined;

      expect(navigationStore.routes[0].active).toBe(false);
      expect(navigationStore.routes[0].children[0].active).toBe(false);
    });

    it("정확한 경로 매치에 대해 활성 상태를 설정해야 함", () => {
      const route: RouteDto = {
        name: "Dashboard",
        fullPath: "/dashboard",
        relativePath: "/dashboard",
        icon: "dashboard",
        children: null,
      };

      navigationStore.currentRoute = route;

      expect(navigationStore.routes[0].active).toBe(true);
      expect(navigationStore.routes[1].active).toBe(false);
      expect(navigationStore.routes[2].active).toBe(false);
    });

    it("자식이 활성화되었을 때 부모 경로의 활성 상태를 설정해야 함", () => {
      const childRoute: RouteDto = {
        name: "Analytics",
        fullPath: "/dashboard/analytics",
        relativePath: "/analytics",
        icon: "chart",
        children: null,
      };

      navigationStore.currentRoute = childRoute;

      // 부모 경로가 활성화되어야 함
      expect(navigationStore.routes[0].active).toBe(true);
      // 자식 경로가 활성화되어야 함
      expect(navigationStore.routes[0].children[0].active).toBe(true);
      // 형제 경로는 활성화되지 않아야 함
      expect(navigationStore.routes[0].children[1].active).toBe(false);
      // 다른 최상위 경로는 활성화되지 않아야 함
      expect(navigationStore.routes[1].active).toBe(false);
    });

    it("중첩된 자식 경로에 대해 활성 상태를 설정해야 함", () => {
      const deepChildRoute: RouteDto = {
        name: "User Detail",
        fullPath: "/users/list/detail",
        relativePath: "/detail",
        icon: "detail",
        children: null,
      };

      navigationStore.currentRoute = deepChildRoute;

      // 부모 경로들이 활성화되어야 함
      expect(navigationStore.routes[1].active).toBe(true); // Users
      expect(navigationStore.routes[1].children[0].active).toBe(true); // List
    });

    it("유사한 경로를 올바르게 처리해야 함", () => {
      const route: RouteDto = {
        name: "User",
        fullPath: "/user",
        relativePath: "/user",
        icon: "user",
        children: null,
      };

      navigationStore.currentRoute = route;

      // /user가 현재 경로일 때 /users는 활성화되지 않아야 함
      expect(navigationStore.routes[1].active).toBe(false);
    });

    it("자식 경로가 부모 경로로 시작할 때 부모 경로를 활성화해야 함", () => {
      const childRoute: RouteDto = {
        name: "Settings Profile",
        fullPath: "/settings/profile",
        relativePath: "/profile",
        icon: "profile",
        children: null,
      };

      navigationStore.currentRoute = childRoute;

      // Settings 경로가 활성화되어야 함
      expect(navigationStore.routes[2].active).toBe(true);
    });
  });

  describe("엣지 케이스", () => {
    beforeEach(() => {
      navigationStore = new NavigationStore(
        plateStore,
        navigatorStore,
        mockRoutes
      );
    });

    it("빈 경로를 처리해야 함", () => {
      const emptyRoute: RouteDto = {
        name: "Root",
        fullPath: "",
        relativePath: "",
        icon: "root",
        children: null,
      };

      navigationStore.currentRoute = emptyRoute;

      // 에러가 발생하지 않아야 함
      expect(navigationStore.currentRoute).toEqual(emptyRoute);
    });

    it("끝에 슬래시가 있는 경로를 처리해야 함", () => {
      const routeWithSlash: RouteDto = {
        name: "Dashboard",
        fullPath: "/dashboard/",
        relativePath: "/dashboard/",
        icon: "dashboard",
        children: null,
      };

      navigationStore.currentRoute = routeWithSlash;

      expect(navigationStore.currentRoute).toEqual(routeWithSlash);
    });

    it("깊게 중첩된 경로를 처리해야 함", () => {
      const deepRoutes: RouteDto[] = [
        {
          name: "Level1",
          fullPath: "/level1",
          relativePath: "/level1",
          icon: "level1",
          children: [
            {
              name: "Level2",
              fullPath: "/level1/level2",
              relativePath: "/level2",
              icon: "level2",
              children: [
                {
                  name: "Level3",
                  fullPath: "/level1/level2/level3",
                  relativePath: "/level3",
                  icon: "level3",
                  children: null,
                },
              ],
            },
          ],
        },
      ];

      navigationStore = new NavigationStore(
        plateStore,
        navigatorStore,
        deepRoutes
      );

      const deepRoute: RouteDto = {
        name: "Level3",
        fullPath: "/level1/level2/level3",
        relativePath: "/level3",
        icon: "level3",
        children: null,
      };

      navigationStore.currentRoute = deepRoute;

      expect(navigationStore.routes[0].active).toBe(true); // Level1
      expect(navigationStore.routes[0].children[0].active).toBe(true); // Level2
      expect(navigationStore.routes[0].children[0].children[0].active).toBe(
        true
      ); // Level3
    });
  });

  describe("initializeCurrentPath", () => {
    it("누락된 window.location을 우아하게 처리해야 함", () => {
      // window.location을 undefined로 모킹
      Object.defineProperty(window, "location", {
        value: undefined,
        writable: true,
      });

      expect(() => {
        navigationStore = new NavigationStore(
          plateStore,
          navigatorStore,
          mockRoutes
        );
      }).not.toThrow();

      expect(navigationStore.currentRoute).toBeUndefined();
    });

    it("pathname이 undefined일 때 빈 문자열을 사용해야 함", () => {
      Object.defineProperty(window, "location", {
        value: {},
        writable: true,
      });

      vi.spyOn(navigatorStore, "getRouteByFullPath").mockImplementation(
        (path) => {
          expect(path).toBe("");
          return undefined;
        }
      );

      navigationStore = new NavigationStore(
        plateStore,
        navigatorStore,
        mockRoutes
      );

      expect(navigatorStore.getRouteByFullPath).toHaveBeenCalledWith(
        "",
        expect.any(Array)
      );
    });
  });
});
