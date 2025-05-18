import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class CategoryNames extends EnumType<CategoryNames>() {
  static readonly THUMBNAIL_IMAGE = new CategoryNames('THUMBNAIL_IMAGE', '썸네일 이미지');
  static readonly THUMBNAIL_VIDEO = new CategoryNames('THUMBNAIL_VIDEO', '썸네일 비디오');
  static readonly VIDEO_CONTENT = new CategoryNames('VIDEO_CONTENT', '영상');
  static readonly AUDIO_CONTENT = new CategoryNames('AUDIO_CONTENT', '오디오');
  static readonly DOCUMENT_CONTENT = new CategoryNames('DOCUMENT_CONTENT', '문서');
  static readonly IMAGE_CONTENT = new CategoryNames('IMAGE_CONTENT', '이미지');

  private constructor(
    readonly _code: string,
    readonly _name: string,
  ) {
    super();
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }
}
