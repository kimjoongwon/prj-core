import { PaymentMethod } from "@cocrepo/prisma";

export const CHECKOUT_PAYMENT_METHODS: readonly PaymentMethod[] = [
	PaymentMethod.CARD,
	PaymentMethod.EXTERNAL,
	PaymentMethod.BANK_TRANSFER,
];
