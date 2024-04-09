import {Serializerable, WVEventHandler} from '@model';
import {isEmpty} from 'lodash';
import {RefObject} from 'react';
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import WebView from 'react-native-webview';
import {MediaWVBridgeEvent} from 'src/model/bridge/MediaWVBridgeEvent';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {fileSystem} from 'src/App';
import {Platform} from 'react-native';
import ImageSelector, {
  ImageSelectorErrorType,
} from 'react-native-image-selector';

export class Media extends Serializerable implements WVEventHandler {
  private static instance: Media;

  private constructor(webviewRef: RefObject<WebView>) {
    super(webviewRef);
  }

  static getInstance(webviewRef: RefObject<WebView>): Media {
    if (!Media.instance) {
      Media.instance = new Media(webviewRef);
    }
    return Media.instance;
  }

  openCamera(options: ImageLibraryOptions) {
    return launchCamera(options);
  }

  async openGallery(options: ImageLibraryOptions) {
    return launchImageLibrary(options);
  }

  async handleWVEvent(event: MediaWVBridgeEvent) {
    let payload = {} as MediaWVBridgeEvent;
    if (event.actionType === 'openCamera') {
      payload = {
        type: 'Media',
        actionType: 'openCamera',
        payload: {
          value: await this.openCamera({
            mediaType: 'photo',
            includeBase64: true,
          }),
        },
      };

      return this.sendMessageFromRNToWV(payload);
    }

    if (event.actionType === 'openGallery') {
      if (Platform.OS !== 'ios') {
        let result = await this.openGallery({
          mediaType: 'photo',
          includeBase64: true,
          assetRepresentationMode: 'compatible',
        });

        if (isEmpty(result?.assets)) {
          return;
        }
        // console.log('result', result.uri);

        const resizedImage = await ImageResizer.createResizedImage(
          result.assets?.[0]?.uri || '',
          result.assets?.[0]?.width || 100,
          result.assets?.[0]?.height || 100,
          'JPEG',
          80,
        );

        const resizedBase64 = await fileSystem.readFile(resizedImage.path);
        result.assets = [
          {
            base64: resizedBase64,
            type: result.assets?.[0]?.type || 'image/jpeg',
          },
        ];

        payload = {
          type: 'Media',
          actionType: 'openGallery',
          payload: {
            value: result,
          },
        };
        return this.sendMessageFromRNToWV(payload);
      } else {
        const _options: any = {
          // import Options
          title: '사진 선택',
          cancelButtonTitle: '취소',
          takePhotoButtonTitle: '사진 촬영',
          chooseFromLibraryButtonTitle: '앨범에서 가져오기',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          permissionDenied: {
            title: '권한 설정',
            text: "이 기능을 이용하시려면 권한을 '허용'으로 변경해주세요.",
            reTryTitle: '변경하러가기',
            okTitle: '닫기',
          },
          iOSGridNumber: 4,
          iOSModalPresentationStyle: 'overFullScreen',
        };

        ImageSelector.launchPicker(
          _options,
          // @ts-ignore
          async (error, response) => {
            if (error) {
              if (
                // @ts-ignore
                error.code === ImageSelectorErrorType.CAMERA_PERMISSION_DENIED
              ) {
                console.error('camera permission denied');
              }
              return;
            }
            if (response) {
              const result: any = {};
              if (response.didCancel) {
                console.log('USER CANCELED');
                return;
              }
              const resizedImage = await ImageResizer.createResizedImage(
                response.uri || '',
                response.width * 0.8 || 100,
                response.height * 0.8 || 100,
                'JPEG',
                100,
              );

              const resizedBase64 = await fileSystem.readFile(
                resizedImage.path,
              );

              if (response?.uri) {
                result.assets = [{base64: resizedBase64, type: 'image/jpeg'}];
              }

              payload = {
                type: 'Media',
                actionType: 'openGallery',
                payload: {
                  value: result,
                },
              };
              return this.sendMessageFromRNToWV(payload);
            }
          },
        );
      }
    }
  }
}
