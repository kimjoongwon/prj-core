import React from 'react';
import { Breadcrumb, BreadcrumbBuilder } from './index';
import type { BreadcrumbItem } from '@shared/types';

/**
 * Breadcrumb Demo Component
 * 다양한 케이스의 Breadcrumb을 보여주는 데모 컴포넌트
 */
export const BreadcrumbDemo: React.FC = () => {
  const mockItems: BreadcrumbItem[] = [
    { name: '홈', pathname: '/', active: false },
    { name: '제품', pathname: '/products', active: false },
    { name: '카테고리', pathname: '/products/category', active: false },
    { name: '상세정보', pathname: '/products/category/detail', active: true },
  ];

  const longMockItems: BreadcrumbItem[] = [
    { name: '홈', pathname: '/', active: false },
    { name: '관리자', pathname: '/admin', active: false },
    { name: '사용자 관리', pathname: '/admin/users', active: false },
    { name: '권한 설정', pathname: '/admin/users/permissions', active: false },
    {
      name: '역할 관리',
      pathname: '/admin/users/permissions/roles',
      active: false,
    },
    {
      name: '상세 설정',
      pathname: '/admin/users/permissions/roles/detail',
      active: true,
    },
  ];

  const handleItemClick = (item: BreadcrumbItem) => {
    console.log('Clicked item:', item);
    alert(`클릭된 아이템: ${item.name}`);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          HeroUI Breadcrumb Demo
        </h1>

        {/* 기본 Breadcrumb */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">기본 Breadcrumb</h2>
          <Breadcrumb items={mockItems} />
        </div>

        {/* 홈 아이콘이 있는 Breadcrumb */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">홈 아이콘 포함</h2>
          <Breadcrumb
            items={mockItems.slice(1)}
            showHomeIcon={true}
            homeRouteName="홈"
            onItemClick={handleItemClick}
          />
        </div>

        {/* 커스텀 구분자 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">커스텀 구분자</h2>
          <Breadcrumb items={mockItems} separator="→" />
        </div>

        {/* 최대 아이템 제한 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">최대 아이템 제한 (3개)</h2>
          <Breadcrumb items={longMockItems} maxItems={3} />
        </div>

        {/* 커스텀 스타일링 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">커스텀 스타일링</h2>
          <Breadcrumb
            items={mockItems}
            className="bg-blue-50 p-4 rounded-md"
            itemClassName="font-medium"
            activeItemClassName="text-blue-600 font-bold"
          />
        </div>

        {/* 긴 아이템 이름 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            긴 아이템 이름 (반응형 테스트)
          </h2>
          <Breadcrumb
            items={[
              { name: '홈', pathname: '/', active: false },
              {
                name: '매우 긴 카테고리 이름이 있는 페이지',
                pathname: '/long-category',
                active: false,
              },
              {
                name: '또 다른 매우 긴 서브카테고리 이름',
                pathname: '/long-category/sub',
                active: false,
              },
              {
                name: '현재 페이지의 매우 긴 제목',
                pathname: '/long-category/sub/current',
                active: true,
              },
            ]}
          />
        </div>

        {/* BreadcrumbBuilder */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">BreadcrumbBuilder</h2>
          <BreadcrumbBuilder
            routeNames={['홈', '제품', '카테고리', '상세정보']}
            separator="•"
            className="bg-green-50 p-3 rounded"
            itemClassName="text-green-700"
            activeItemClassName="font-bold text-green-900"
          />
        </div>

        {/* 모바일 반응형 안내 */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            📱 반응형 기능 안내
          </h3>
          <ul className="text-yellow-700 space-y-1">
            <li>• 모바일에서는 홈 아이콘 텍스트가 숨겨집니다</li>
            <li>
              • 긴 아이템 이름은 자동으로 잘리고 hover 시 전체 이름을 볼 수
              있습니다
            </li>
            <li>• 화면 크기에 따라 아이템 최대 너비가 조정됩니다</li>
            <li>• maxItems를 사용하여 표시할 아이템 수를 제한할 수 있습니다</li>
          </ul>
        </div>

        {/* 기능 설명 */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            ✨ 주요 기능
          </h3>
          <ul className="text-blue-700 space-y-1">
            <li>• HeroUI 기반의 아름다운 디자인</li>
            <li>• 완전한 반응형 지원</li>
            <li>• 커스터마이징 가능한 구분자</li>
            <li>• 홈 아이콘 지원</li>
            <li>• 클릭 이벤트 처리</li>
            <li>• 활성 아이템 스타일링</li>
            <li>• 최대 아이템 수 제한</li>
            <li>• TypeScript 완전 지원</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbDemo;
