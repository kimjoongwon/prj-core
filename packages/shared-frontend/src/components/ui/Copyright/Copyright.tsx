export interface CopyrightProps {
	companyName: string;
	className?: string;
}

import dayjs from "dayjs";

export const Copyright = (props: CopyrightProps) => {
	const { companyName } = props;
	return (
		<p className="text-xs text-center text-gray-500">
			© {dayjs().get("year")} {companyName}. All rights reserved.
		</p>
	);
};
