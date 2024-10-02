import React from 'react';
import { getTemplatesByQuery, TemplatesTable } from '@shared/frontend';
import { cookies } from 'next/headers';

const TemplatesPage = async () => {
  const accessToken = cookies().get('accessToken');
  const templatesQuery = await getTemplatesByQuery(
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken?.value}`,
      },
    },
  );

  return <TemplatesTable hideHeader templates={templatesQuery.data || []} />;
};

export default TemplatesPage;
