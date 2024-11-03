import { ListboxItemProps } from '@nextui-org/react';
import { LinkProps } from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { v4 } from 'uuid';

export const useMenus = () => {
  const menus: ListboxItemProps<LinkProps>[] = [
    {
      key: v4(),
      children: '카테고리 관리',
      href: '/admin/main/space-service/categories',
      description: '서비스에 그룹과 카테고리를 생성하고 관리합니다.',
      endContent: <FiChevronRight />,
    },
    {
      key: v4(),
      children: '그룹 관리',
      href: '/admin/main/space-service/groups',
      description: '서비스 그룹을 생성하고 관리합니다.',
      endContent: <FiChevronRight />,
    },
    {
      key: v4(),
      children: '그룹 관리',
      href: '/admin/main/space-service/spaces',
      description: '공간을 생성하고 관리합니다.',
      endContent: <FiChevronRight />,
    },
  ];

  return menus;
};
