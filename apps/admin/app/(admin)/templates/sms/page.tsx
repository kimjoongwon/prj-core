"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * SMS 템플릿 페이지
 */
export default function SmsTemplatesPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">SMS 템플릿</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">SMS 템플릿 페이지</Text>
      </CardBody>
    </Card>
  );
}
