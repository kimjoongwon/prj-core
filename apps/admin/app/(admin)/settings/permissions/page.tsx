"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 권한 관리 페이지
 */
export default function PermissionsSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">권한 관리</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">권한 관리 페이지</Text>
      </CardBody>
    </Card>
  );
}
