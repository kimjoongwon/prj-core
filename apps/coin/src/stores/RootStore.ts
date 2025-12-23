import { makeAutoObservable } from "mobx";
import { SafeStore } from "./SafeStore";
import { TransactionStore } from "./TransactionStore";
import { WalletStore } from "./WalletStore";

export class RootStore {
	wallet: WalletStore;
	safe: SafeStore;
	transaction: TransactionStore;

	constructor() {
		makeAutoObservable(this);
		this.wallet = new WalletStore();
		this.safe = new SafeStore();
		this.transaction = new TransactionStore();
	}
}

export const rootStore = new RootStore();
