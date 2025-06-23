import React from 'react';
import { usePlate } from '../providers/App/AppProvider';

/**
 * PlateStore 사용 예시 컴포넌트
 * 
 * 새로운 아키텍처에서는 모든 스토어들이 PlateStore를 통해 접근됩니다.
 * - plate.navigation: 라우트 관리와 네비게이션 상태
 * - plate.navigator: 실제 네비게이션 실행
 * - plate.auth: 인증 관련 상태와 로직
 */
export const PlateStoreUsageExample = () => {
  const plate = usePlate();

  const handleNavigateHome = () => {
    // 직접 경로로 네비게이션
    plate.navigator.push('/home');
  };

  const handleNavigateByName = () => {
    // 라우트 이름으로 네비게이션
    plate.navigator.pushByName('사용자 목록');
  };

  const handleNavigateWithParams = () => {
    // 경로 매개변수와 쿼리 문자열을 포함한 네비게이션
    plate.navigator.push('/users/:id', { id: '123' }, { tab: 'profile' });
  };

  const getCurrentRoute = () => {
    // 현재 활성화된 라우트 정보 조회
    return plate.navigation.currentRoute;
  };

  const getRouteChildren = () => {
    // 특정 라우트의 자식 라우트들 조회
    return plate.navigation.getDirectChildrenByName('대시보드');
  };

  return (
    <div>
      <h2>PlateStore 사용 예시</h2>
      
      <div>
        <h3>네비게이션</h3>
        <button onClick={handleNavigateHome}>
          홈으로 이동 (plate.navigator.push)
        </button>
        <button onClick={handleNavigateByName}>
          라우트 이름으로 이동 (plate.navigator.pushByName)
        </button>
        <button onClick={handleNavigateWithParams}>
          매개변수와 함께 이동
        </button>
      </div>

      <div>
        <h3>현재 상태</h3>
        <p>현재 경로: {plate.navigation.currentFullPath}</p>
        <p>현재 라우트 이름: {plate.navigation.currentRoute?.name}</p>
        <p>PlateStore 초기화 상태: {plate.isInitialized ? '완료' : '진행중'}</p>
      </div>

      <div>
        <h3>인증 상태 (추후 확장 예정)</h3>
        <p>Auth Store: {plate.auth ? '연결됨' : '미연결'}</p>
      </div>
    </div>
  );
};

/**
 * 커스텀 훅을 사용한 더 간단한 접근 방법
 */
export const useSimpleNavigation = () => {
  const plate = usePlate();

  return {
    // 네비게이션 메소드들
    navigateTo: plate.navigator.push,
    navigateByName: plate.navigator.pushByName,
    goBack: plate.navigator.goBack,
    
    // 현재 상태
    currentPath: plate.navigation.currentFullPath,
    currentRoute: plate.navigation.currentRoute,
    
    // 라우트 검색
    findRoute: plate.navigation.getRouteByName,
    getChildren: plate.navigation.getDirectChildrenByName,
  };
};
