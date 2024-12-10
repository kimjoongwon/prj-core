import { Logo } from '../Logo';
import { Divider } from '@nextui-org/react';
import { HStack } from '../HStack';
import { Avatar } from '../Avatar';
import { AppBarViewProps } from '.';

export const AppBarView = (props: AppBarViewProps) => {
  const { content } = props;
  return (
    <div
      style={{
        height: 62,
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <HStack className="flex flex-1 items-center justify-evenly px-4">
        <div className="flex-1">
          <Logo variants={'text'} />
        </div>
        <div className="flex-1 md:flex hidden justify-center">{content}</div>
        <div className="flex flex-1 justify-end">
          <Avatar />
        </div>
      </HStack>
      <Divider />
    </div>
  );
};
