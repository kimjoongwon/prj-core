import { Enum, EnumType } from "ts-jenum";

@Enum("code")
export class CategoryTypes extends EnumType<CategoryTypes>() {
  static readonly ROLE = new CategoryTypes("Role", "역할");
  static readonly SPACE = new CategoryTypes("Space", "공간");
  static readonly FILE = new CategoryTypes("File", "파일");
  static readonly USER = new CategoryTypes("User", "사용자");

  private constructor(
    readonly _code: string,
    readonly _name: string
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
