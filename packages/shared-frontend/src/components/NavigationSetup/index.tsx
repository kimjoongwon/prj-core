'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plate } from '../../providers/App/AppProvider';

/**
 * Router 컨텍스트 내부에서 navigation 함수를 설정하는 컴포넌트
 * 이 컴포넌트는 Router 내부에서만 사용되어야 합니다.
 */
export const NavigationSetup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Plate이 초기화되었을 때 navigation 함수 설정
    if (Plate?.navigation) {
      Plate.navigation.setNavigateFunction(navigate);
    }
  }, [navigate]);

  // 이 컴포넌트는 렌더링하지 않음
  return null;
};

NavigationSetup.displayName = 'NavigationSetup';
