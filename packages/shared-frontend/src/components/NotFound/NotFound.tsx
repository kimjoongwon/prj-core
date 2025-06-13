import React from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import { useNavigate } from 'react-router';
import { Container } from '../Container';
import { VStack } from '../VStack';
import { Text } from '../Text';
import { Spacer } from '../Spacer';

export interface NotFoundProps {
  /**
   * 페이지 제목
   */
  title?: string;
  /**
   * 페이지 설명
   */
  description?: string;
  /**
   * 홈으로 돌아가기 버튼 텍스트
   */
  homeButtonText?: string;
  /**
   * 이전 페이지로 돌아가기 버튼 텍스트
   */
  backButtonText?: string;
  /**
   * 홈 경로
   */
  homePath?: string;
  /**
   * 추가 액션 버튼들
   */
  actions?: React.ReactNode;
  /**
   * 커스텀 아이콘
   */
  icon?: React.ReactNode;
}

/**
 * 404 Not Found 페이지 컴포넌트
 */
export const NotFound: React.FC<NotFoundProps> = ({
  title = '페이지를 찾을 수 없습니다',
  description = '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.',
  homeButtonText = '홈으로 돌아가기',
  backButtonText = '이전 페이지',
  homePath = '/',
  actions,
  icon,
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(homePath);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const defaultIcon = (
    <div className="text-9xl text-gray-300 font-bold">404</div>
  );

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardBody className="text-center p-8">
          <VStack className="gap-6 items-center">
            {icon || defaultIcon}

            <VStack className="gap-2 items-center">
              <Text variant="h2" className="text-foreground">
                {title}
              </Text>
              <Text variant="body1" className="text-default-500 text-center">
                {description}
              </Text>
            </VStack>

            <Spacer size={8} />

            {actions || (
              <VStack className="gap-3 w-full">
                <Button
                  color="primary"
                  variant="solid"
                  size="lg"
                  onClick={handleGoHome}
                  className="w-full"
                >
                  {homeButtonText}
                </Button>

                <Button
                  color="default"
                  variant="bordered"
                  size="md"
                  onClick={handleGoBack}
                  className="w-full"
                >
                  {backButtonText}
                </Button>
              </VStack>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default NotFound;
