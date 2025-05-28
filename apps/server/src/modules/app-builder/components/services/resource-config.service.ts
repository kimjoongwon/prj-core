
import { Injectable } from '@nestjs/common';
import { ResourceConfig } from '../types/page.types';

@Injectable()
export class ResourceConfigService {
  private readonly configs: Record<string, ResourceConfig> = {
    Category: {
      name: 'Category',
      label: '카테고리',
      invalidationKey: '/api/v1/categories',
    },
    Group: {
      name: 'Group',
      label: '그룹',
      invalidationKey: '/api/v1/groups',
    },
    Ground: {
      name: 'Ground',
      label: '그라운드',
      invalidationKey: '/api/v1/grounds',
    },
    Role: {
      name: 'Role',
      label: '역할',
      invalidationKey: '/api/v1/roles',
    },
  };

  getConfig(resourceName: string): ResourceConfig {
    const config = this.configs[resourceName];
    if (!config) {
      throw new Error(`Resource config not found for: ${resourceName}`);
    }
    return config;
  }

  registerConfig(resourceName: string, config: ResourceConfig): void {
    this.configs[resourceName] = config;
  }
}
