import { CopyrightView } from './CopyrightView';

export interface CopyrightProps {
  companyName: string;
  className?: string;
}

export const Copyright = (props: CopyrightProps) => {
  return <CopyrightView companyName={props.companyName} />;
};
