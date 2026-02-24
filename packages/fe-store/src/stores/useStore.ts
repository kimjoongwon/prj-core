"use client";

import { createContext, useContext } from "react";
import { RootStore } from "./rootStore";

export const RootStoreContext = createContext<RootStore | null>(null);

/**
 * RootStore를 가져오는 기본 hook
 */
export const useStore = () => {
	const store = useContext(RootStoreContext);
	if (!store) {
		throw new Error("useStore must be used within a RootStoreProvider");
	}
	return store;
};

/**
 * RootStore를 가져오는 hook (별칭)
 */
export const useRootStore = useStore;

/**
 * NavigationStore를 가져오는 selector hook
 * RootStore에서 navigationStore만 선택하여 반환
 */
export const useNavigationStore = () => {
	const store = useStore();
	if (!store.navigationStore) {
		throw new Error("navigationStore가 초기화되지 않았습니다.");
	}
	return store.navigationStore;
};

/**
 * PersistStore를 가져오는 selector hook
 * RootStore에서 persistStore만 선택하여 반환
 */
export const usePersistStore = () => {
	const store = useStore();
	if (!store.persistStore) {
		throw new Error("persistStore가 초기화되지 않았습니다.");
	}
	return store.persistStore;
};

/**
 * AuthStore를 가져오는 selector hook
 * RootStore에서 authStore만 선택하여 반환
 */
export const useAuthStore = () => {
	const store = useStore();
	if (!store.authStore) {
		throw new Error("authStore가 초기화되지 않았습니다.");
	}
	return store.authStore;
};

/**
 * AssetStore를 가져오는 selector hook
 * RootStore에서 assetStore만 선택하여 반환
 */
export const useAssetStore = () => {
	const store = useStore();
	if (!store.assetStore) {
		throw new Error("assetStore가 초기화되지 않았습니다.");
	}
	return store.assetStore;
};

/**
 * AlbumStore를 가져오는 selector hook
 * RootStore에서 albumStore만 선택하여 반환
 */
export const useAlbumStore = () => {
	const store = useStore();
	if (!store.albumStore) {
		throw new Error("albumStore가 초기화되지 않았습니다.");
	}
	return store.albumStore;
};

/**
 * TimelineStore를 가져오는 selector hook
 * RootStore에서 timelineStore만 선택하여 반환
 */
export const useTimelineStore = () => {
	const store = useStore();
	if (!store.timelineStore) {
		throw new Error("timelineStore가 초기화되지 않았습니다.");
	}
	return store.timelineStore;
};

/**
 * GroundStore를 가져오는 selector hook
 * RootStore에서 groundStore만 선택하여 반환
 */
export const useGroundStore = () => {
	const store = useStore();
	if (!store.groundStore) {
		throw new Error("groundStore가 초기화되지 않았습니다.");
	}
	return store.groundStore;
};

/**
 * ExerciseStore를 가져오는 selector hook
 * RootStore에서 exerciseStore만 선택하여 반환
 */
export const useExerciseStore = () => {
	const store = useStore();
	if (!store.exerciseStore) {
		throw new Error("exerciseStore가 초기화되지 않았습니다.");
	}
	return store.exerciseStore;
};

/**
 * ProgramStore를 가져오는 selector hook
 * RootStore에서 programStore만 선택하여 반환
 */
export const useProgramStore = () => {
	const store = useStore();
	if (!store.programStore) {
		throw new Error("programStore가 초기화되지 않았습니다.");
	}
	return store.programStore;
};

/**
 * ReservationStore를 가져오는 selector hook
 * RootStore에서 reservationStore만 선택하여 반환
 */
export const useReservationStore = () => {
	const store = useStore();
	if (!store.reservationStore) {
		throw new Error("reservationStore가 초기화되지 않았습니다.");
	}
	return store.reservationStore;
};
