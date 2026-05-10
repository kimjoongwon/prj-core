"use client";

import { PaymentManagementPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { usePaymentManagementPageData } from "../hooks/usePaymentManagementPageData";

export default observer(function PaymentsPageRoute() {
	const paymentManagementPageData = usePaymentManagementPageData();
	const onClickRefreshButton = () => {
		void paymentManagementPageData.refetch();
	};

	return (
		<PaymentManagementPage
			payments={paymentManagementPageData.payments}
			summary={paymentManagementPageData.summary}
			queryState={paymentManagementPageData.queryState}
			onClickRefresh={onClickRefreshButton}
		/>
	);
});
