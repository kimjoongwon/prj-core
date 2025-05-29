'use client';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from '@heroui/react';
import {
  RouteVisualizer,
  ConditionalNavigationButton,
  RouteNavigationButton,
  HStack,
  VStack,
} from '@shared/frontend';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useRouteNavigator } from '@shared/frontend';

/**
 * 라우트 관리 및 시각화 데모 페이지
 */
const RouteManagementPage = observer(() => {
  // 상태 관리를 위한 observable 객체
  const state = useLocalObservable(() => ({
    routeName: '',
    condition: true,
    routeIfTrue: '로그인',
    routeIfFalse: '관리자',
    toggleCondition() {
      this.condition = !this.condition;
    },
  }));

  const { navigateByName } = useRouteNavigator();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">라우트 관리 도구</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 라우트 네비게이션 컨트롤 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">라우트 네비게이션</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <VStack className="space-y-6">
              {/* 이름으로 네비게이션 */}
              <div className="space-y-3">
                <h3 className="font-semibold">이름으로 네비게이션</h3>
                <HStack className="items-end space-x-2">
                  <Input
                    label="라우트 이름"
                    value={state.routeName}
                    onValueChange={value => {
                      state.routeName = value;
                    }}
                  />
                  <Button
                    color="primary"
                    onPress={() => navigateByName(state.routeName)}
                  >
                    이동
                  </Button>
                </HStack>
                <div className="pt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    자주 사용하는 라우트:
                  </p>
                  <HStack className="flex-wrap gap-2">
                    <RouteNavigationButton
                      routeName="로그인"
                      color="primary"
                      variant="bordered"
                      size="sm"
                    >
                      로그인
                    </RouteNavigationButton>
                    <RouteNavigationButton
                      routeName="관리자"
                      color="secondary"
                      variant="bordered"
                      size="sm"
                    >
                      관리자
                    </RouteNavigationButton>
                    <RouteNavigationButton
                      routeName="메인"
                      color="success"
                      variant="bordered"
                      size="sm"
                    >
                      메인
                    </RouteNavigationButton>
                  </HStack>
                </div>
              </div>

              <Divider />

              {/* 조건부 네비게이션 */}
              <div className="space-y-3">
                <h3 className="font-semibold">조건부 네비게이션</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="mr-2">현재 조건 상태:</span>
                    <div
                      className={`px-2 py-0.5 rounded text-sm ${
                        state.condition
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {state.condition ? 'TRUE' : 'FALSE'}
                    </div>
                    <Button
                      className="ml-auto"
                      size="sm"
                      variant="flat"
                      color={state.condition ? 'success' : 'danger'}
                      onPress={() => state.toggleCondition()}
                    >
                      조건 전환
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="True일 때 라우트"
                      size="sm"
                      value={state.routeIfTrue}
                      onValueChange={value => {
                        state.routeIfTrue = value;
                      }}
                    />
                    <Input
                      label="False일 때 라우트"
                      size="sm"
                      value={state.routeIfFalse}
                      onValueChange={value => {
                        state.routeIfFalse = value;
                      }}
                    />
                  </div>

                  <ConditionalNavigationButton
                    condition={state.condition}
                    routeNameIfTrue={state.routeIfTrue}
                    routeNameIfFalse={state.routeIfFalse}
                    color="primary"
                    className="w-full"
                  >
                    조건부 이동
                  </ConditionalNavigationButton>
                </div>
              </div>
            </VStack>
          </CardBody>
        </Card>

        {/* 라우트 시각화 */}
        <div className="h-[600px]">
          <RouteVisualizer />
        </div>
      </div>
    </div>
  );
});

export default RouteManagementPage;
