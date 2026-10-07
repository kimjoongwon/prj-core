"use client";

import { Check } from "lucide-react";
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
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                <Check className="h-4 w-4 text-accent-foreground" />
              </span>
            )}
          </HStack>
          <Chip size="sm">{option.vendor}</Chip>
        </HStack>

        <Typography.Paragraph size="sm" color="muted">
          {option.tagline}
        </Typography.Paragraph>

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
