"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 발송 이력 페이지
 */
export default function NotificationHistoryPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">발송 이력</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">발송 이력 페이지</Text>
      </CardBody>
    </Card>
  );
}
