import { getYear } from "@cocrepo/toolkit";

export interface CopyrightProps {
  companyName: string;
  className?: string;
}

export const Copyright = (props: CopyrightProps) => {
  const { companyName } = props;
  return (
    <p className="text-center text-gray-500 text-xs">
      © {getYear()} {companyName}. All rights reserved.
    </p>
  );
};
