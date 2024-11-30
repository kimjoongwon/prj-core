import { Alert, Snackbar } from '@mui/material';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';

export const notification = observable({
  open: false,
  message: '',
  severity: 'success',
});

export const NotificationBuilder = observer(() => {
  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={() => (notification.open = false)}
    >
      <Alert
        onClose={() => (notification.open = false)}
        severity="success"
        variant="outlined"
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
});
