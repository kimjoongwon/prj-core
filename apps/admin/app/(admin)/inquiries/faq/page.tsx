"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * FAQ 관리 페이지
 */
export default function FaqPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">FAQ 관리</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">FAQ 관리 페이지</Text>
      </CardBody>
    </Card>
  );
}
