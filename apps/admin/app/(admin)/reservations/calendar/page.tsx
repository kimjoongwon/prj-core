"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 예약 캘린더 페이지
 */
export default function ReservationCalendarPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">예약 캘린더</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">예약 캘린더 페이지</Text>
      </CardBody>
    </Card>
  );
}
