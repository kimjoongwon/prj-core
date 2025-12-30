"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 1:1 문의 페이지
 */
export default function OneOnOneInquiryPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">1:1 문의</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">1:1 문의 페이지</Text>
      </CardBody>
    </Card>
  );
}
