"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const InteractionClient = dynamic(
	() => import("./_client").then((module) => module.InteractionClient),
	{
		ssr: false,
	},
);

type InteractionPageParams = {
	uid: string;
};

export default function InteractionPage() {
	const { uid } = useParams<InteractionPageParams>();

	return <InteractionClient uid={uid} />;
}
