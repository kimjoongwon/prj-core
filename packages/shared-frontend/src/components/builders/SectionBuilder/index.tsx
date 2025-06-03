'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { SectionBuilder as SectionBuilderInterface } from '@shared/types';
import { ElementBuilder } from '../ElementBuilder';
import { v4 } from 'uuid';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { VStack } from '../../VStack';
import { HStack } from '../../HStack';

interface SectionBuilderProps {
  sectionBuilder: SectionBuilderInterface;
}

export const SectionBuilder = observer((props: SectionBuilderProps) => {
  const { sectionBuilder } = props;

  return (
    <Card
      shadow="none"
      className={sectionBuilder.bordered ? 'border border-gray-200' : ''}
    >
      {sectionBuilder.name && <CardHeader>{sectionBuilder.name}</CardHeader>}
      <CardBody>
        {sectionBuilder.stacks?.map(stack => {
          if (stack.type === 'VStack') {
            return (
              <VStack key={v4()} className="space-y-2">
                {stack.elements?.map(element => {
                  return <ElementBuilder key={v4()} elementBuilder={element} />;
                })}
              </VStack>
            );
          }
          return (
            <HStack key={v4()} className="">
              {stack.elements?.map(element => {
                return <ElementBuilder key={v4()} elementBuilder={element} />;
              })}
            </HStack>
          );
        })}
      </CardBody>
    </Card>
  );
});
