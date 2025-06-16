import React from 'react';
import { Card, CardBody, Progress, Spinner, Chip } from '@heroui/react';
import { VStack } from '../VStack';
import { Logo } from '../Logo';
import { Text } from '../Text';

export interface SplashScreenProps {
  title?: string;
  subtitle?: string;
  progress?: number;
  showProgress?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  title = '앱을 준비하고 있습니다',
  subtitle = '잠시만 기다려주세요...',
  progress,
  showProgress = true,
}) => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-default-900 dark:to-default-800" />

      {/* 메인 카드 */}
      <Card className="relative z-10 w-full max-w-md mx-4 shadow-2xl border-none">
        <CardBody className="p-8">
          <VStack className="items-center space-y-6">
            {/* 로고 */}
            <div className="animate-pulse">
              <Logo variants="text" className="text-3xl" />
            </div>

            {/* 타이틀과 서브타이틀 */}
            <VStack className="items-center space-y-2 text-center">
              <Text variant="h4" className="text-foreground">
                {title}
              </Text>
              <Text variant="subtitle2" className="text-default-500">
                {subtitle}
              </Text>
            </VStack>

            {/* 프로그레스 바 */}
            {showProgress && (
              <div className="w-full space-y-2">
                <Progress
                  aria-label="Loading progress"
                  value={progress !== undefined ? progress : undefined}
                  color="primary"
                  className="max-w-md"
                  isIndeterminate={progress === undefined}
                  size="sm"
                />

                {/* 퍼센티지 표시 */}
                {progress !== undefined && (
                  <div className="text-center">
                    <Chip
                      size="sm"
                      variant="flat"
                      color="primary"
                      className="text-xs"
                    >
                      {Math.round(progress)}%
                    </Chip>
                  </div>
                )}
              </div>
            )}

            {/* 로딩 상태 텍스트 */}
            <Text variant="caption" className="text-default-400 animate-pulse">
              시스템을 초기화하는 중...
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* 장식용 배경 요소들 */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200/20 dark:bg-primary-500/10 rounded-full blur-xl animate-pulse" />
      <div
        className="absolute top-32 right-20 w-16 h-16 bg-secondary-200/20 dark:bg-secondary-500/10 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-24 h-24 bg-success-200/20 dark:bg-success-500/10 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute bottom-32 right-10 w-18 h-18 bg-warning-200/20 dark:bg-warning-500/10 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: '0.5s' }}
      />
    </div>
  );
};
