import { BottomTabProps } from '.';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { Paper } from '@mui/material';

export interface BottomTabViewProps extends BottomTabProps {}

export const BottomTabView = (props: BottomTabViewProps) => {
  const [value, setValue] = useState();
  const { tabs } = props;
  const visibleTabs = tabs?.filter(tab => tab.isVisible);
  const isMoreTabVisible = visibleTabs?.length > 4;

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
          tab?.onClick?.();
        }}
        value={value}
      >
        {visibleTabs?.map((tab, index) => {
          if (!tab.isVisible) {
            return null;
          }
          if (index > 2) {
            return;
          }
          return (
            <BottomNavigationAction
              value={tab.name}
              label={tab.name}
              icon={tab.icon}
            />
          );
        })}
        {isMoreTabVisible && (
          <BottomNavigationAction
            label="더보기"
            icon={<AddIcon />}
            value={'더보기'}
          />
        )}
      </BottomNavigation>
    </Paper>
  );
};
