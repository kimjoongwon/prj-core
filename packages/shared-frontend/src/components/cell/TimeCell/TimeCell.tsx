import { CellContext } from "@tanstack/react-table";
import dayjs from "dayjs";
import React from "react";

export const TimeCell = <T,>(cellContext: CellContext<T, unknown>) => {
  const { getValue } = cellContext;

  if (!getValue()) {
    return <p>-</p>;
  }

  return <p>{dayjs(getValue() as string).format("HH:mm")}</p>;
};
