"use client";

import { Check } from "lucide-react";
import { Card } from "@heroui/react";
import { Chip, VStack, HStack, Typography } from "@cocrepo/ui";

interface ChoiceCardProps {
  selected: boolean;
  onSelect: () => void;
  name: string;
  vendor: string;
  tagline: string;
  pros: string[];
  cons: string[];
  costRange: string;
  bestFor: string;
}

export function ChoiceCard({
  selected,
  onSelect,
  name,
  vendor,
  tagline,
  pros,
  cons,
  costRange,
  bestFor,
}: ChoiceCardProps) {
  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer border-2 p-5 transition-all ${
        selected
          ? "border-accent bg-accent-soft shadow-lg"
          : "border-border bg-surface hover:border-accent/50"
      }`}
    >
      <VStack gap="inline" alignItems="start">
        <HStack justifyContent="between" fullWidth>
          <HStack gap="inline" alignItems="center">
            <Typography.Heading level={4}>{name}</Typography.Heading>
            {selected && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                <Check className="h-4 w-4 text-accent-foreground" />
              </span>
            )}
          </HStack>
          <Chip color={selected ? "accent" : "default"} size="sm">
            {vendor}
          </Chip>
        </HStack>
        <p className="text-sm text-foreground/70">{tagline}</p>
        <VStack gap="dense" alignItems="start">
          {pros.map((pro) => (
            <p key={pro} className="flex items-start gap-1.5 text-sm">
              <span className="text-accent">+</span>
              <span className="text-foreground/90">{pro}</span>
            </p>
          ))}
          {cons.map((con) => (
            <p key={con} className="flex items-start gap-1.5 text-sm">
              <span className="text-danger">-</span>
              <span className="text-foreground/60">{con}</span>
            </p>
          ))}
        </VStack>
        <HStack gap="inline" className="mt-2">
          <Chip size="sm" variant="soft">
            💰 {costRange}
          </Chip>
          <Chip size="sm" variant="soft" color="accent">
            ★ {bestFor}
          </Chip>
        </HStack>
      </VStack>
    </Card>
  );
}
