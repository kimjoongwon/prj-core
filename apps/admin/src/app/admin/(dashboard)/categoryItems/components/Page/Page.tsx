'use client';

import { observer } from 'mobx-react-lite';
import { usePage } from '../PageProvider/hooks';
import { Card } from '@coc/ui';
import { CategorySection } from './CategorySection';
import { CategoryItems } from './CategoryItems';

export const Page = observer(() => {
  const page = usePage();
  const {
    meta: {
      section: { categoryItemTrees },
    },
  } = page;

  return (
    <Card>
      {categoryItemTrees.map(categoryItemTree => {
        return (
          <CategorySection>
            <CategoryItems categoryItems={categoryItemTree} />
          </CategorySection>
        );
      })}
    </Card>
  );
});
