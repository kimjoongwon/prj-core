import { MetaView } from './MetaView';

export interface MetaProps {
  name: string;
  value: string;
}

export const Meta = (props: MetaProps) => {
  return <MetaView {...props} />;
};
