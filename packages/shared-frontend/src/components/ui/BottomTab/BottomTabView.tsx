import { Paper } from '@mui/material';
import { BottomTabViewProps } from '@shared/types';
import { HStack } from '../HStack';

export const BottomTabView = (props: BottomTabViewProps) => {
  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <HStack className="h-14 items-center justify-center w-full md:hidden flex">
        {props.children}
      </HStack>
    </Paper>
  );
};
