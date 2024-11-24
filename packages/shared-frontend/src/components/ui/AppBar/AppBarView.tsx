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
        <div className="flex">
          <Logo variants={'text'} />
        </div>
        <div className="flex-1 md:flex hidden">{props.children}</div>
        <div className="flex flex-1 justify-end">
          <Avatar size="sm" />
        </div>
      </HStack>
      <Divider />
    </div>
  );
};
