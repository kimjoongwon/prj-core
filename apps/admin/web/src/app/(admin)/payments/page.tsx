"use client";

import { usePaymentData } from "@cocrepo/hook";
import { PaymentScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export default observer(function PaymentsPageRoute() {
	const paymentData = usePaymentData();
	const onClickRefreshButton = () => {
		void paymentData.refetch();
	};

	return (
		<>
			<PaymentScreen
				payments={paymentData.payments}
				summary={paymentData.summary}
				queryState={paymentData.queryState}
				onClickRefresh={onClickRefreshButton}
			/>
		</>
	);
});
