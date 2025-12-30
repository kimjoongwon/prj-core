"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 알림 템플릿 페이지
 */
export default function NotificationTemplatesPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">알림 템플릿</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">알림 템플릿 페이지</Text>
      </CardBody>
    </Card>
  );
}
