import dayjs from 'dayjs';
import { CopyrightProps } from '.';

interface CopyrightViewProps extends CopyrightProps {}

export const CopyrightView = (props: CopyrightViewProps) => {
  const { companyName } = props;
  return (
    <p className="text-xs text-center text-gray-500">
      © {dayjs().get('year')} {companyName}. All rights reserved.
    </p>
  );
};
