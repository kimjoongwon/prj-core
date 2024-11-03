import { ListboxItemProps } from '@nextui-org/react';
import { FiChevronRight } from 'react-icons/fi';

export const useMenus = () => {
  const menus: ListboxItemProps[] = [
    {
      key: 'sessions',
      children: '세션 관리',
      href: '/admin/main/reservation/sessions',
      endContent: <FiChevronRight />,
      description: '세션을 생성하고 관리합니다.',
    },
    {
      key: 'timelineItems',
      children: '타임라인 관리',
      href: '/admin/main/reservation/timelineItems',
      endContent: <FiChevronRight />,
      description: '타임라인 아이템을 생성하고 관리합니다.',
    },
  ];

  return menus;
};
