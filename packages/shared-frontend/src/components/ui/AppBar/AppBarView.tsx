import { Logo } from '../Logo';
import { Card } from '@nextui-org/react';
import { HStack } from '../HStack';
import { Avatar } from '../Avatar';
import { AppBarViewProps } from '.';

export const AppBarView = (props: AppBarViewProps) => {
  const { content } = props;
  return (
    <Card className="flex h-[62px] flex-col justify-center rounded-none">
      <HStack className="flex flex-1 items-center justify-evenly px-4">
        <div className="flex-1">
          <Logo variants={'text'} />
        </div>
        <div className="flex-1 sm:flex hidden justify-center">{content}</div>
        <div className="flex flex-1 justify-end">
          <Avatar />
        </div>
      </HStack>
    </Card>
  );
};
