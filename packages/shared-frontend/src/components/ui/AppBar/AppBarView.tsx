import { Paper } from '@mui/material';
import { AppBarProps } from '.';
import { Logo } from '../Logo';
import { Avatar, Divider } from '@nextui-org/react';
import { HStack } from '../HStack';

export interface AppBarViewProps extends AppBarProps {}

export const AppBarView = (props: AppBarViewProps) => {
  return (
    <div
      {...props}
      style={{
        height: 62,
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <HStack className="flex-1 items-center justify-between px-4">
        <Logo variants={'text'} alt="로고" />
        <Avatar size="sm" />
      </HStack>
      <Divider />
    </div>
  );
};
