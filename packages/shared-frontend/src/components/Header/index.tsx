'use client';

import { Logo } from '../Logo';
import { Card, Chip, Button } from '@heroui/react';
import { HStack } from '../HStack';
import { Avatar } from '../Avatar';
import { HeaderProps } from '@shared/types';

export const Header = (props: HeaderProps) => {
  const { content, children } = props;
  return (
    <Card className="flex h-[62px] flex-col justify-center rounded-none overflow-visible">
      <HStack className="flex flex-1 items-center px-4">
        {/* Desktop Layout */}
        <div className="hidden xl:flex flex-1 items-center justify-between w-full">
          {/* Desktop: Logo */}
          <div className="flex-1">
            <Logo variants={'text'} />
          </div>
          
          {/* Desktop: Navigation Content */}
          <div className="flex-1 flex justify-center">{content}</div>
          
          {/* Desktop: Right Side */}
          <div className="flex-1 flex justify-end items-center space-x-2">
            <Chip color="primary" size="sm">
              {process.env.NODE_ENV === 'development' ? '개발' : '운영'}
            </Chip>
            <Avatar showInfo={true} />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex xl:hidden items-center w-full relative">
          {/* Mobile: Left - Hamburger Menu */}
          <div className="flex items-center w-12">
            {children}
          </div>
          
          {/* Mobile: Center - Logo (absolute positioning for true center) */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Logo variants={'text'} />
          </div>
          
          {/* Mobile: Right - Environment Chip + Avatar */}
          <div className="flex items-center space-x-2 ml-auto">
            <Chip color="primary" size="sm">
              {process.env.NODE_ENV === 'development' ? '개발' : '운영'}
            </Chip>
            <Avatar showInfo={false} />
          </div>
        </div>
      </HStack>
    </Card>
  );
};
