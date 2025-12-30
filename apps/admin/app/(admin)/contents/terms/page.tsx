"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 약관 관리 페이지
 */
export default function TermsPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">약관 관리</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">약관 관리 페이지</Text>
      </CardBody>
    </Card>
  );
}
