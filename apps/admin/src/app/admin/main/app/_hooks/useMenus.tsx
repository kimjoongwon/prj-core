import { ListboxItemProps } from '@nextui-org/react';
import { LinkProps } from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

export const useMenus = () => {
  const menus: ListboxItemProps<LinkProps>[] = [
    {
      key: '',
      children: '서비스 관리',
      href: '/admin/main/app/services',
      description: '서비스에 그룹과 카테고리를 생성하고 관리합니다.',
      endContent: <FiChevronRight />,
    },
    {
      key: 'templates',
      children: '템플릿 관리',
      href: '/admin/main/app/templates',
      description: '서비스에 사용할 템플릿을 생성하고 관리합니다.',
      endContent: <FiChevronRight />,
    },
  ];

  return menus;
};
