import { User, Avatar as HeroUIAvatar, Button, Chip } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { BrowserUtil, EnvironmentUtil } from '@shared/utils';
import { useLogout } from '@shared/api-client';
import { Dropdown, DropdownItemProps } from '../../inputs/Dropdown';

interface AvatarProps {
  showInfo?: boolean;
  onMenuAction?: (key: string) => void;
}

export const Avatar = observer((props: AvatarProps) => {
  const { showInfo = true, onMenuAction } = props;
  const logoutMutation = useLogout();

  const environment = EnvironmentUtil.getCurrentEnvironment();

  const userMenuItems: DropdownItemProps[] = [
    {
      key: 'environment',
      label: '환경 정보',
      description: `현재 ${environment.name} 환경입니다`,
      startContent: (
        <Chip
          size="sm"
          color={environment.color}
          variant="flat"
          className="text-xs"
        >
          {environment.name}
        </Chip>
      ),
      isDisabled: true,
    },
    {
      key: 'divider-0',
      label: '',
      isDisabled: true,
    },
    {
      key: 'profile',
      label: '프로필',
      description: '계정 정보 관리',
      startContent: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      key: 'settings',
      label: '설정',
      description: '앱 설정 및 환경설정',
      startContent: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      key: 'divider-1',
      label: '',
      isDisabled: true,
    },
    {
      key: 'help',
      label: '도움말',
      description: '사용 가이드 및 문의',
      startContent: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      key: 'logout',
      label: '로그아웃',
      description: '계정에서 로그아웃',
      color: 'danger',
      startContent: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 713-3h4a3 3 0 013 3v1"
          />
        </svg>
      ),
    },
  ];

  const handleMenuAction = (key: string) => {
    switch (key) {
      case 'profile':
        console.log('프로필 페이지로 이동');
        break;
      case 'settings':
        console.log('설정 페이지로 이동');
        break;
      case 'help':
        console.log('도움말 페이지로 이동');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
    onMenuAction?.(key);
  };

  const handleLogout = async () => {
    try {
      console.log('로그아웃 처리 중...');

      // Call backend logout API to clear HttpOnly cookies
      await logoutMutation.mutateAsync();

      // Clear client-side storage
      BrowserUtil.clearLocalStorage();
      BrowserUtil.clearSessionStorage();

      // Navigate to login page
      BrowserUtil.navigateTo('/admin/auth/login', true);
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);

      // Even if API call fails, clear client storage and redirect
      BrowserUtil.clearLocalStorage();
      BrowserUtil.clearSessionStorage();
      BrowserUtil.navigateTo('/admin/auth/login', true);
    }
  };

  if (showInfo) {
    // Desktop: Show full user info with dropdown
    return (
      <Dropdown
        dropdownItems={userMenuItems}
        onAction={handleMenuAction}
        placement="bottom-end"
        trigger={
          <Button
            variant="light"
            className="h-auto p-0 bg-transparent data-[hover=true]:bg-transparent"
          >
            <User
              name="슈퍼매니저"
              description="총괄"
              avatarProps={{
                src: '/moka.webp',
                size: 'sm',
              }}
              className="cursor-pointer"
            />
          </Button>
        }
      />
    );
  }

  // Mobile: Show only avatar image with dropdown
  return (
    <Dropdown
      dropdownItems={userMenuItems}
      onAction={handleMenuAction}
      placement="bottom-end"
      trigger={
        <Button
          isIconOnly
          variant="light"
          className="bg-transparent data-[hover=true]:bg-transparent"
        >
          <HeroUIAvatar
            src="/moka.webp"
            name="슈퍼매니저"
            size="sm"
            className="cursor-pointer"
          />
        </Button>
      }
    />
  );
});
