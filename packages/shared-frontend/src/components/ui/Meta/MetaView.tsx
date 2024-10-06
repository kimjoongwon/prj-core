import { MetaProps } from '.';
import { HStack } from '../HStack';
import { Text } from '../Text';

export interface MetaViewProps extends MetaProps {}

export const MetaView = (props: MetaViewProps) => {
  const { name, value } = props;
  return (
    <HStack className="flex-1 w-full items-center justify-evenly">
      <Text variant="label">{name}</Text>
      <Text variant="subtitle1">{value}</Text>
    </HStack>
  );
};
