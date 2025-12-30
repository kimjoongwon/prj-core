"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 공지사항 페이지
 */
export default function NoticesPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">공지사항</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">공지사항 페이지</Text>
      </CardBody>
    </Card>
  );
}
