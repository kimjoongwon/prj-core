"use client";

import { Chip, VStack, HStack, Typography } from "@cocrepo/ui";
import { Card } from "@heroui/react";
import type { TechOption } from "../data/types";

interface ChoiceCardProps {
  selected: boolean;
  onSelect: () => void;
  option: TechOption;
}

export function ChoiceCard({ selected, onSelect, option }: ChoiceCardProps) {
  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer border-2 p-5 transition-all ${
        selected
          ? "border-accent bg-accent-soft"
          : "border-border hover:border-accent/50"
      }`}
    >
      <VStack gap="inline" alignItems="start">
        <HStack justifyContent="between" fullWidth>
          <HStack gap="inline" alignItems="center">
            <Typography.Heading level={4}>{option.name}</Typography.Heading>
            {selected && (
              <span aria-hidden="true" className="text-lg leading-none">✅</span>
            )}
          </HStack>
          <HStack gap="dense" alignItems="center">
            {option.isRecommended && (
              <Chip size="sm" variant="soft" color="accent">추천</Chip>
            )}
            <Chip size="sm">{option.vendor}</Chip>
          </HStack>
        </HStack>

        <Typography.Paragraph size="sm" color="muted">
          {option.tagline}
        </Typography.Paragraph>

        {option.warning && (
          <div className="w-full rounded-lg border border-danger bg-danger/5 p-2.5">
            <HStack gap="dense" alignItems="start">
              <span aria-hidden="true" className="text-sm leading-none">⚠️</span>
              <Typography.Paragraph size="xs" className="font-semibold text-danger">
                {option.warning}
              </Typography.Paragraph>
            </HStack>
          </div>
        )}

        <VStack gap="dense" alignItems="start">
          {option.pros.map((pro) => (
            <HStack key={pro} gap="dense" alignItems="start">
              <span className="text-accent">+</span>
              <Typography.Paragraph size="sm">{pro}</Typography.Paragraph>
            </HStack>
          ))}
          {option.cons.map((con) => (
            <HStack key={con} gap="dense" alignItems="start">
              <span className="text-danger">−</span>
              <Typography.Paragraph size="sm" color="muted">{con}</Typography.Paragraph>
            </HStack>
          ))}
        </VStack>

        <HStack gap="inline" className="mt-2">
          <Chip size="sm" variant="soft">💰 {option.costRange}</Chip>
          <Chip size="sm" variant="soft" color="accent">★ {option.bestFor}</Chip>
        </HStack>
      </VStack>
    </Card>
  );
}
