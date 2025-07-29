import { CellContext } from "@tanstack/react-table";
import React from "react";

export const TextCell = <T,>(cellContext: CellContext<T, unknown>) => {
  const { getValue, row } = cellContext;
  const value = getValue();

  if (!value && value !== 0) {
    return <p>-</p>;
  }

  return <p>{String(value)}</p>;
};
