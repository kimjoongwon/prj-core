import { NavigationSetup, NotFound } from "@shared/frontend";
import { Outlet, createRootRoute } from "@tanstack/react-router";

const AppLayout = () => (
  <>
    <NavigationSetup />
    <Outlet />
  </>
);

export const Route = createRootRoute({
  component: AppLayout,
  errorComponent: () => (
    <NotFound
      title="오류가 발생했습니다"
      description="페이지를 로드하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      homePath="/admin/dashboard"
      homeButtonText="대시보드로 돌아가기"
    />
  ),
  notFoundComponent: () => (
    <NotFound
      title="페이지를 찾을 수 없습니다"
      description="요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다."
      homePath="/admin/dashboard"
      homeButtonText="대시보드로 돌아가기"
    />
  ),
});
