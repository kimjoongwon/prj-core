"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * Ground 정보 페이지
 */
export default function GroundSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">Ground 정보</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">Ground 정보 페이지</Text>
      </CardBody>
    </Card>
  );
}
