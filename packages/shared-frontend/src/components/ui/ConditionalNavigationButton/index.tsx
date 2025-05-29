import { Button } from '@shared/frontend';
import { useRouteNavigator } from '@shared/frontend';
import { observer } from 'mobx-react-lite';

interface ConditionalNavigationButtonProps {
  condition: boolean;
  routeNameIfTrue: string;
  routeNameIfFalse: string;
  children: React.ReactNode;
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

/**
 * 조건에 따라 다른 경로로 이동하는 버튼
 * 조건이 true면 routeNameIfTrue에 해당하는 경로로, false면 routeNameIfFalse로 이동합니다.
 */
export const ConditionalNavigationButton = observer(
  (props: ConditionalNavigationButtonProps) => {
    const {
      condition,
      routeNameIfTrue,
      routeNameIfFalse,
      children,
      onClick,
      ...rest
    } = props;
    
    const { navigateByCondition } = useRouteNavigator();
    
    const handleClick = () => {
      if (onClick) {
        onClick();
      }
      
      navigateByCondition(condition, routeNameIfTrue, routeNameIfFalse);
    };
    
    return (
      <Button onPress={handleClick} {...rest}>
        {children}
      </Button>
    );
  }
);
