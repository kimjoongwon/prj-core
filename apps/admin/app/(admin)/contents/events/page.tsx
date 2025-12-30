"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 이벤트 페이지
 */
export default function EventsPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">이벤트</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">이벤트 페이지</Text>
      </CardBody>
    </Card>
  );
}
