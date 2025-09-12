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
		<div className="w-full h-full min-h-0 flex items-center justify-center">
			<img
				src={adImageSrc}
				alt={adImageAlt}
				className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
			/>
		</div>
	) : null;

	const finalAdComponent = adComponent || defaultAdComponent;

	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex flex-col md:flex-row flex-1 w-full min-h-0">
				{/* Mobile */}
				<div className="flex flex-col w-full md:hidden">
					<div className="flex-1 p-6">{formComponent}</div>
				</div>
				{/* Desktop */}
				<div className="hidden md:flex flex-1 flex-row w-full min-h-0">
					<div className="flex-1 flex items-center justify-center p-10">
						<div className="w-full max-w-md">{formComponent}</div>
					</div>
					<div className="flex-1 flex items-center justify-center p-4 min-h-0">
						<div className="w-full h-full min-h-0">{finalAdComponent}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
