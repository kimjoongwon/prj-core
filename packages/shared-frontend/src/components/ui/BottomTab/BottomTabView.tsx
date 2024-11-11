import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { BottomNavigationProps, Paper } from '@mui/material';
import { Paths } from '../../../constants/Paths';

interface Route {
  name: string;
  pathname: Paths;
  params?: object;
  isVisible?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: Route[];
}
export interface BottomTabViewProps extends BottomNavigationProps {
  tabs: Route[];
}

export const BottomTabView = (props: BottomTabViewProps) => {
  const { onChange, defaultValue, tabs } = props;

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation showLabels onChange={onChange} value={defaultValue}>
        {tabs?.map(tab => {
          return (
            <BottomNavigationAction
              key={tab.name}
              label={tab.name}
              icon={tab.icon}
              value={tab.name}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
};
