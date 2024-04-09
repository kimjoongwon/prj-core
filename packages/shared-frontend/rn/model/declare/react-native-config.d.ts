declare module 'react-native-config' {
  export interface NativeConfig {
    APP_VERSION: number;
    APP_NAME: string;
    APP_ENV: 'PROD' | 'STG' | 'MA' | 'LOCAL';
    APP_ID: string;
    IOS_APP_VERSION: string;
    IOS_BUNDLE_VERSION: number;
    AOS_APP_VERSION: string;
    AOS_APP_VERSION_CODE: number;
    USER_AGENT: string;
    BUILD_TYPE: 'release' | 'debug';
    APP_DOMAIN:
      | 'https://stg.mysuni.sk.com'
      | 'https://mysuni.sk.com'
      | 'https://ma.mysuni.sk.com';
    PANOPTO_DOMAIN: 'https://sku.ap.panopto.com';
    PANOPTO_INSTANCE: 'STG-SKU' | 'MA-SKU' | 'SKU';
    SALT: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
