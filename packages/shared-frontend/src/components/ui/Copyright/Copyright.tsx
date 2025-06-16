import { CopyrightView } from './CopyrightView';
import { CopyrightProps } from '@shared/types';

export const Copyright = (props: CopyrightProps) => {
  return <CopyrightView companyName={props.companyName} />;
};
