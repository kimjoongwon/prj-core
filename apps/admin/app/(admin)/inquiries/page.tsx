"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 문의 목록 페이지
 */
export default function InquiriesPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">문의 목록</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">문의 목록 페이지</Text>
      </CardBody>
    </Card>
  );
}
