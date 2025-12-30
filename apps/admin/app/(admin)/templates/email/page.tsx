"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 이메일 템플릿 페이지
 */
export default function EmailTemplatesPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">이메일 템플릿</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">이메일 템플릿 페이지</Text>
      </CardBody>
    </Card>
  );
}
