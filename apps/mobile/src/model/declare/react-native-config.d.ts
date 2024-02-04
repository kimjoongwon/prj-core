declare module 'react-native-config' {
  export interface NativeConfig {
    APP_NAME: string;
    APP_ENV: 'prod' | 'stg' | 'ma' | 'local';
    APP_VERSION: number;
    APP_BUILD: number;
    APP_BUNDLE_ID: string;
    USER_AGENT: string;
    BUILD_TYPE: 'release' | 'debug';
    APP_DOMAIN:
      | 'https://stg.connect.mysuni.com'
      | 'https://connect.mysuni.com'
      | 'https://ma.connect.mysuni.com';
    PANOPTO_DOMAIN: 'https://sku.ap.panopto.com';
    PANOPTO_INSTANCE: 'STG-CONNECT' | 'MA-CONNECT' | 'SKU';
  }

  export const Config: NativeConfig;
  export default Config;
}
