import { Component, type ErrorInfo, type ReactNode } from "react";

interface MomoAvatarErrorBoundaryProps {
	children: ReactNode;
	onUnavailable: () => void;
}

/** React의 오류 복구 프로토콜에만 쓰는 상태. 표시 상태는 Panel의 MobX가 소유한다. */
export class MomoAvatarErrorBoundary extends Component<
	MomoAvatarErrorBoundaryProps,
	{ hasFailed: boolean }
> {
	state = { hasFailed: false };

	static getDerivedStateFromError() {
		return { hasFailed: true };
	}

	componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
		this.props.onUnavailable();
	}

	render() {
		return this.state.hasFailed ? null : this.props.children;
	}
}
