import { Paper } from '@mui/material';
import { AppBarProps } from '.';
import { Logo } from '../Logo';

export interface AppBarViewProps extends AppBarProps {}

export const AppBarView = (props: AppBarViewProps) => {
  return (
    <Paper
      {...props}
      sx={{
        height: 62,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Logo variants={'text'} alt="로고" />
    </Paper>
  );
};
