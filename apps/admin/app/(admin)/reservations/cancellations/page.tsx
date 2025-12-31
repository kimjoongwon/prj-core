"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 취소/환불 관리 페이지
 */
export default function CancellationsPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">취소/환불 관리</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">취소/환불 관리 페이지</Text>
      </CardBody>
    </Card>
  );
}
