"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 관리자 계정 페이지
 */
export default function AdminsSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">관리자 계정</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">관리자 계정 페이지</Text>
      </CardBody>
    </Card>
  );
}
