import { Divider } from '@nextui-org/react';
import { MetaProps } from '.';
import { HStack } from '../HStack';
import { Text } from '../Text';
import { VStack } from '../VStack';

export interface MetaViewProps extends MetaProps {}

export const MetaView = (props: MetaViewProps) => {
  const { name, value } = props;

  return (
    <HStack className="items-center justify-evenly ">
      <Text variant="label" className="flex-grow-0 basis-40 text-left">
        {name}
      </Text>
      <Text variant="text" className="text-left flex-1">
        {value}
      </Text>
    </HStack>
  );
};
