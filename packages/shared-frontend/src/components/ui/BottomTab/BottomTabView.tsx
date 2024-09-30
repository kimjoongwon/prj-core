import { BottomTabProps } from '.';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useState } from 'react';
import { Paper } from '@mui/material';
import { galaxy } from '../../../providers';

export interface BottomTabViewProps extends BottomTabProps {}

export const BottomTabView = (props: BottomTabViewProps) => {
  const [value, setValue] = useState();
  const { tabs } = props;

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        onChange={(_, value) => {
          setValue(value);
          const tab = tabs?.find(tab => tab.name === value);
          const { pathname, params } = tab;

          galaxy.router.push({
            url: pathname,
            params,
          });
        }}
        value={value}
      >
        {tabs?.map(tab => {
          return (
            <BottomNavigationAction
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
