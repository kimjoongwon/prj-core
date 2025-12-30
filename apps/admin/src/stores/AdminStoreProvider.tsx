"use client";

import { ADMIN_MENU_CONFIG } from "@cocrepo/constant";
import { type AbilityActions, useAbility } from "@cocrepo/hook";
import {
  AuthStore,
  CookieStore,
  MenuItem,
  MenuStore,
  RootStore,
  TokenStore,
  createStoreContext,
  createStoreSelector,
} from "@cocrepo/store";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

/**
 * Admin 앱용 RootStore 생성 함수
 *
 * RootStore를 생성하고 Admin 앱에 필요한 Store들을 주입합니다.
 */
function createAdminRootStore(): RootStore {
  const rootStore = new RootStore();

  // 각 Store를 인스턴스화하여 RootStore에 주입
  rootStore.tokenStore = new TokenStore(rootStore);
  rootStore.cookieStore = new CookieStore();
  rootStore.authStore = new AuthStore(rootStore);
  rootStore.menuStore = new MenuStore(ADMIN_MENU_CONFIG as MenuItem[]);

  return rootStore;
}

/**
 * Admin 앱 전용 RootStore Context 생성
 * 제너릭을 활용하여 타입 안정성 확보
 */
const {
  StoreProvider: AdminStoreProviderBase,
  useStore: useAdminStore,
  StoreContext: AdminStoreContext,
} = createStoreContext<RootStore>("AdminStore");

/**
 * MenuStore selector hook
 * RootStore에서 menuStore만 선택하여 반환
 */
const useAdminMenuStore = createStoreSelector(useAdminStore, (store) => {
  if (!store.menuStore) {
    throw new Error("menuStore가 초기화되지 않았습니다.");
  }
  return store.menuStore;
});

interface AdminStoreProviderProps {
  children: ReactNode;
}

/**
 * Admin Store Provider
 *
 * RootStore를 최상단에서 초기화하고 하위 컴포넌트에 제공합니다.
 * Router, Pathname, Ability 변경 시 MenuStore의 핸들러를 자동 업데이트합니다.
 *
 * @example
 * ```tsx
 * // providers.tsx에서 사용
 * <AdminStoreProvider>
 *   {children}
 * </AdminStoreProvider>
 *
 * // 컴포넌트에서 사용
 * const store = useAdminStore(); // RootStore 타입
 * const menuStore = useAdminMenuStore(); // MenuStore 타입
 * ```
 */
function AdminStoreProvider({ children }: AdminStoreProviderProps) {
  return (
    <AdminStoreProviderBase createStore={createAdminRootStore}>
      <AdminStoreInitializer>{children}</AdminStoreInitializer>
    </AdminStoreProviderBase>
  );
}

/**
 * Store 초기화 컴포넌트
 * Provider 내부에서 hooks를 사용하여 Store를 초기화합니다.
 */
function AdminStoreInitializer({ children }: { children: ReactNode }) {
  const store = useAdminStore();
  const router = useRouter();
  const pathname = usePathname();
  const ability = useAbility();

  const menuStore = store.menuStore;

  // menuStore가 없으면 초기화 중이므로 렌더링하지 않음
  if (!menuStore) {
    return null;
  }

  // ability 변경 시 체커 업데이트
  useEffect(() => {
    menuStore.setAbilityChecker((action, subject) =>
      ability.can(action as AbilityActions, subject)
    );
  }, [ability, menuStore]);

  // router 변경 시 네비게이션 핸들러 업데이트
  useEffect(() => {
    menuStore.setNavigateHandler((path) => router.push(path as never));
  }, [router, menuStore]);

  // URL 경로 변경 시 메뉴 활성화 상태 업데이트
  useEffect(() => {
    menuStore.setCurrentPath(pathname);
  }, [pathname, menuStore]);

  return children;
}

export {
  AdminStoreContext,
  AdminStoreProvider,
  useAdminMenuStore,
  useAdminStore,
};
