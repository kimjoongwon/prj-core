"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 공지사항 페이지
 */
export default function NoticesPage() {
	return (
		<Card>
			<CardHeader>
				<h4 className="text-xl font-bold">공지사항</h4>
			</CardHeader>
			<CardBody>
				<p>공지사항 페이지</p>
			</CardBody>
		</Card>
	);
}
