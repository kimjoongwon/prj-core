"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * HTML 템플릿 페이지
 */
export default function HtmlTemplatesPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">HTML 템플릿</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">HTML 템플릿 페이지</Text>
      </CardBody>
    </Card>
  );
}
