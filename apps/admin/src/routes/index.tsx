import { useStore } from "@cocrepo/store";
import { createFileRoute, Navigate } from "@tanstack/react-router";

const IndexComponent = () => {
	const { authStore } = useStore();

	if (authStore?.isAuthenticated) {
		return <Navigate to="/admin/dashboard" />;
	}

	return <Navigate to="/admin/auth/login" />;
};

export const Route = createFileRoute("/")({
	component: IndexComponent,
});
