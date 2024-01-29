export type RNConsoleWVBridgeEvent = {
  type: 'RNConsole';
  actionType: 'log';
  payload: {
    tag?: string;
    message?: string;
  };
};
