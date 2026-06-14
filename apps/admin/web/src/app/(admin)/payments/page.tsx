"use client";

import { PaymentScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { usePaymentData } from "@cocrepo/hook";

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
