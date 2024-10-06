import { galaxy } from '@shared/frontend';

export const useTabs = () => {
  const tabs = [
    {
      title: '서비스',
      value: '서비스',
      default: true,
      onClick: () => galaxy.router.push({ url: '/admin/main/app/services' }),
    },
    {
      title: '템플릿',
      value: '템플릿',
      default: false,
      onClick: () =>
        galaxy.router.push({
          url: '/admin/main/templates',
        }),
    },
  ];

  return tabs;
};
