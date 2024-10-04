import { Paper, Typography } from '@mui/material';
import { Tabs } from '@shared/frontend';

export type ServicePageParams = {
  serviceId: string | 'new';
};

const ServicePage = () => {
  return (
    <Paper>
      <Typography variant="h4">Service</Typography>
    </Paper>
  );
};

export default ServicePage;
