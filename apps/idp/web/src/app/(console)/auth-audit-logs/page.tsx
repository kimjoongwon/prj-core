"use client";

import dynamic from "next/dynamic";

const AuthAuditLogsClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function AuthAuditLogsPage() {
	return <AuthAuditLogsClient />;
}
