// PageBuilder interface - moved from @shared/types
interface PageBuilderInterface {
	state: any;
	[key: string]: any;
}

import { defaultTo } from "lodash-es";
import { observer, useLocalObservable } from "mobx-react-lite";
import React, { createContext } from "react";
import { v4 } from "uuid";

interface PageProviderProps {
	pageBuilder: PageBuilderInterface;
	isFetchedAfterMount?: boolean;
	children: React.ReactNode;
}

const PageContext = createContext<PageBuilderInterface>(
	{} as PageBuilderInterface,
);

export const PageProvider = observer((props: PageProviderProps) => {
	const page = useLocalObservable(() => ({
		...props.pageBuilder,
		state: {
			...props.pageBuilder.state,
			setState: (newState: any) => defaultTo(page.state, newState),
		},
	}));

	return (
		<PageContext.Provider value={page}>
			<div className={`hi-${v4()}`} />
			{props.children}
		</PageContext.Provider>
	);
});

PageContext.displayName = "PageContext";
PageProvider.displayName = "PageProvider";

export const usePage = (): PageBuilderInterface => {
	const page = React.useContext(PageContext);
	if (!page) {
		throw new Error("usePage must be used within a PageProvider");
	}
	return page;
};
