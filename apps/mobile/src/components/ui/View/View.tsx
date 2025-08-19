import React from "react";
import { View as RNView, ViewProps as RNViewProps } from "react-native";

export interface ViewProps extends RNViewProps {
	children?: React.ReactNode;
}

export const View: React.FC<ViewProps> = ({ children, ...props }) => {
	return <RNView {...props}>{children}</RNView>;
};

export default View;