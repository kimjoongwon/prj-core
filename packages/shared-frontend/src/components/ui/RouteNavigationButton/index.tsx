import { Button } from '@shared/frontend';
import { useRouteNavigator } from '@shared/frontend';
import { observer } from 'mobx-react-lite';

interface RouteNavigationButtonProps {
  routeName: string;
  children: React.ReactNode;
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

/**
 * 라우트 이름으로 이동하는 버튼
 */
export const RouteNavigationButton = observer(
  (props: RouteNavigationButtonProps) => {
    const { routeName, children, onClick, ...rest } = props;
    
    const { navigateByName } = useRouteNavigator();
    
    const handleClick = () => {
      if (onClick) {
        onClick();
      }
      
      navigateByName(routeName);
    };
    
    return (
      <Button onPress={handleClick} {...rest}>
        {children}
      </Button>
    );
  }
);
