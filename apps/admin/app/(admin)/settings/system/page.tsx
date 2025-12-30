"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 시스템 설정 페이지
 */
export default function SystemSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">시스템 설정</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">시스템 설정 페이지</Text>
      </CardBody>
    </Card>
  );
}
