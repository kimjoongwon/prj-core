import { makeAutoObservable } from "mobx";
import type { AccessControlStore } from "./accessControl/accessControlStore";
import type { AccountStore } from "./account/accountStore";
import type { LanguageStore } from "./language/languageStore";
import type { ModalStore } from "./modal/modalStore";
import type { NavigationStore } from "./navigation/navigationStore";

export interface AppStoreState {
	account: AccountStore;
	accessControl: AccessControlStore;
	language: LanguageStore;
	modal: ModalStore;
	navigation: NavigationStore;
	name: string;
}

/**
 * 실행 중인 앱의 public 상태 트리를 소유합니다.
 *
 * AppStore의 하위 상태는 RootStore가 조립하여 전달합니다. 컴포넌트와
 * 공용 hook은 `useApp()`을 통해 이 객체에서 상태 탐색을 시작합니다.
 */
export class AppStore {
	name: string;
	readonly account: AccountStore;
	readonly accessControl: AccessControlStore;
	readonly language: LanguageStore;
	readonly modal: ModalStore;
	readonly navigation: NavigationStore;

	constructor(state: AppStoreState) {
		this.name = state.name;
		this.account = state.account;
		this.accessControl = state.accessControl;
		this.language = state.language;
		this.modal = state.modal;
		this.navigation = state.navigation;

		makeAutoObservable(this, {
			account: false,
			accessControl: false,
			language: false,
			modal: false,
			navigation: false,
		});
	}

	/**
	 * 현재 선택 Space의 콘텐츠 언어 코드입니다.
	 */
	get contentLanguageCode(): AccountStore["contentLanguageCode"] {
		return this.account.contentLanguageCode;
	}
}
