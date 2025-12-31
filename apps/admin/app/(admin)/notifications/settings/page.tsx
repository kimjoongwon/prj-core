"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 푸시 설정 페이지
 */
export default function NotificationSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">푸시 설정</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">푸시 설정 페이지</Text>
      </CardBody>
    </Card>
  );
}
