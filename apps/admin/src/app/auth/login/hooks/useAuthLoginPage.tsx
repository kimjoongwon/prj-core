import { useLogin } from "@cocrepo/api";
import { LoginSchema, validateSchema } from "@cocrepo/schema";
import type { LoginPageState } from "@cocrepo/ui";
import { useLocalObservable } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { usePersistStore } from "@/stores/AppStoreProvider";

// 로그인 페이지에 필요한 모든 속성을 생성하는 훅
export const useAuthLoginPage = () => {
	const router = useRouter();
	const persistStore = usePersistStore();
	const loginMutation = useLogin();

	const isDev = process.env.NODE_ENV === "development";

	const state = useLocalObservable<LoginPageState>(() => ({
		email: isDev ? "ceo@f45training.co.kr" : "",
		password: isDev ? "SuperAdmin123!@#" : "",
		errorMessage: "",
	}));

	const onClickLoginButton = async () => {
		state.errorMessage = "";

		const result = await validateSchema(LoginSchema, {
			email: state.email,
			password: state.password,
		});

		if (!result.isValid) {
			state.errorMessage = result.errors[0].messages[0];
			return;
		}

		try {
			const response = await loginMutation.mutateAsync({
				data: {
					email: result.data.email,
					password: result.data.password,
				},
			});

			const data = response.data;

			// 1. 토큰 만료 시간 저장
			if (data?.accessTokenExpiresAt && data?.refreshTokenExpiresAt) {
				persistStore.setTokenExpiries(
					data.accessTokenExpiresAt,
					data.refreshTokenExpiresAt,
				);
			}

			// 2. Space 목록 저장 (헤더 SpaceSelector에서 사용)
			const tenants = data?.user?.tenants;
			if (tenants && tenants.length > 0) {
				const spaces = tenants
					.filter((t) => t.spaceId && t.space?.ground?.name)
					.map((t) => ({
						spaceId: t.spaceId,
						groundName: t.space!.ground!.name,
					}));
				persistStore.setSpaces(spaces);
			}

			// 3. 현재 Space 선택 (localStorage 기억값 우선, 없으면 첫 번째 tenant)
			let targetTenant = persistStore.spaceId
				? tenants?.find((t) => t.spaceId === persistStore.spaceId)
				: undefined;

			if (!targetTenant) {
				targetTenant = tenants?.[0];
			}

			if (targetTenant?.spaceId && targetTenant?.space?.ground?.name) {
				const groundName = targetTenant.space.ground.name;
				persistStore.setSpace(targetTenant.spaceId, groundName);
				// 4. 대시보드로 이동
				router.push("/dashboard");
			} else {
				// Space/Ground가 없는 경우
				// TODO: Space 선택 페이지 구현 후 활성화
				// alert("Space를 선택해주세요.");
				// router.push("/select-space");
				router.push("/dashboard");
			}
		} catch (_error) {
			state.errorMessage =
				"로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
		}
	};

	const onKeyDownInput = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			onClickLoginButton();
		}
	};

	return {
		state,
		onClickLoginButton,
		onKeyDownInput,
		isLoading: loginMutation.isPending,
	};
};
