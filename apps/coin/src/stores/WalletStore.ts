import { makeAutoObservable } from "mobx";

export class WalletStore {
	// 지갑 연결 상태
	address: string | null = null;
	chainId: number | null = null;
	isConnected = false;
	isConnecting = false;

	constructor() {
		makeAutoObservable(this);
	}

	// 지갑 연결 상태 업데이트
	setConnected(address: string, chainId: number) {
		this.address = address;
		this.chainId = chainId;
		this.isConnected = true;
		this.isConnecting = false;
	}

	// 연결 해제
	disconnect() {
		this.address = null;
		this.chainId = null;
		this.isConnected = false;
		this.isConnecting = false;
	}

	// 연결 중 상태
	setConnecting(connecting: boolean) {
		this.isConnecting = connecting;
	}

	// 체인 변경
	setChainId(chainId: number) {
		this.chainId = chainId;
	}

	// 짧은 주소 형식 (0x1234...5678)
	get shortAddress(): string | null {
		if (!this.address) return null;
		return `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
	}
}

export const walletStore = new WalletStore();
