import { DateTimeUtil } from "@shared/utils";

export interface CopyrightProps {
	companyName: string;
	className?: string;
}

export const Copyright = (props: CopyrightProps) => {
	const { companyName } = props;
	return (
		<p className="text-xs text-center text-gray-500">
			© {DateTimeUtil.getYear()} {companyName}. All rights reserved.
		</p>
	);
};
