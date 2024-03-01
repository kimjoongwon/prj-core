import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.promise.app',
  appName: 'Promise',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    url: 'http://192.168.0.41:3000',
    cleartext: true,
  },
};

export default config;
