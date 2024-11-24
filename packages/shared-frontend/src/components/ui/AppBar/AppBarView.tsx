import { Logo } from '../Logo';
import { Avatar, Divider } from '@nextui-org/react';
import { HStack } from '../HStack';
import { AppBarViewProps } from '@shared/types';

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
      <HStack className="flex flex-1 items-center justify-evenly px-4">
        <Logo variants={'text'} />
        <div className="flex flex-1 flex-row justify-center">
          {props.children}
        </div>
        <Avatar size="sm" />
      </HStack>
      <Divider />
    </div>
  );
};
