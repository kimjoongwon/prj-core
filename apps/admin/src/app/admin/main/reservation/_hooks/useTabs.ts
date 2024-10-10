import { galaxy, Tab } from '@shared/frontend';
import { useParams, usePathname } from 'next/navigation';

export const useTabs = () => {
  const pathname = usePathname();

  const tabs: Tab[] = [
    {
      text: '세션',
      value: '/admin/main/sessions',
      onClick: () => galaxy.router.push({ url: '/admin/main/sessions' }),
    },
    {
      text: '타임라인',
      value: '/admin/main/timelineItems',
      onClick: () => galaxy.router.push({ url: '/admin/main/timelineItems' }),
    },
  ];

  return tabs;
};
