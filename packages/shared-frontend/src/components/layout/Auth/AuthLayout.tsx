import { ReactNode } from "react";

export const AuthLayout = (props: {
	formComponent?: ReactNode;
	adComponent?: ReactNode;
	adImageSrc?: string;
	adImageAlt?: string;
}) => {
	const {
		formComponent,
		adComponent,
		adImageSrc,
		adImageAlt = "Advertisement",
	} = props;

	// If no adComponent is provided but adImageSrc is provided, create default image component
	const defaultAdComponent = adImageSrc ? (
		<div className="flex h-full min-h-0 w-full items-center justify-center">
			<img
				src={adImageSrc}
				alt={adImageAlt}
				className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
			/>
		</div>
	) : null;

	const finalAdComponent = adComponent || defaultAdComponent;

	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex min-h-0 w-full flex-1 flex-col md:flex-row">
				{/* Mobile */}
				<div className="flex w-full flex-col md:hidden">
					<div className="flex-1 p-6">{formComponent}</div>
				</div>
				{/* Desktop */}
				<div className="hidden min-h-0 w-full flex-1 flex-row md:flex">
					<div className="flex flex-1 items-center justify-center p-10">
						<div className="w-full max-w-md">{formComponent}</div>
					</div>
					<div className="flex min-h-0 flex-1 items-center justify-center p-4">
						<div className="h-full min-h-0 w-full">{finalAdComponent}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
