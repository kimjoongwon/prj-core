import { Button } from '../Button';
import { cn } from '@heroui/react';
import { HStack } from '../HStack';
import { useGetCurrentSpace } from '@shared/api-client';

export interface LogoProps {
  variants: 'text' | 'icon';
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const Logo = (props: LogoProps) => {
  const { className, onClick } = props;
  const {
    data: getCurrentSpaceResponse,
    error,
    isLoading,
    isError,
  } = useGetCurrentSpace();

  const spaceName = getCurrentSpaceResponse?.data?.ground?.name;

  // 에러 처리 개선
  if (isError && error) {
    console.error('getCurrentSpace API error:', {
      message: error.message,
      status: (error as any)?.status || 'unknown',
      response: (error as any)?.response || null,
    });
  }

  const displayName = isLoading
    ? '플레이트 X (로딩중...)'
    : spaceName
    ? `플레이트 X ${spaceName}`
    : '플레이트 X';

  return (
    <HStack className="items-center">
      {/* <Image src="/logo.png" alt="logo" width={50} height={50} /> */}
      <Button
        variant="light"
        className={cn(className, 'font-bold text-2xl p-0')}
        onPress={onClick}
      >
        {displayName}
      </Button>
    </HStack>
  );
};
