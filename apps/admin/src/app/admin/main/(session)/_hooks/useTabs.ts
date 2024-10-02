import { galaxy } from '@shared/frontend';

export const useTabs = () => {
  const tabs = [
    {
      title: '세션',
      value: 'sessions',
      default: true,
      onClick: () => galaxy.router.push({ url: '/admin/main/sessions' }),
    },
    {
      title: '타임라인',
      value: 'timeline-items',
      default: false,
      onClick: () => galaxy.router.push({ url: '/admin/main/timelineItems' }),
    },
  ];

  return tabs;
};
