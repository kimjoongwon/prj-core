"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ImageSelectorErrorType = void 0;
var _reactNative = require("react-native");
let ImageSelectorErrorType = exports.ImageSelectorErrorType = /*#__PURE__*/function (ImageSelectorErrorType) {
  ImageSelectorErrorType[ImageSelectorErrorType["CAMERA_PERMISSION_DENIED"] = 100] = "CAMERA_PERMISSION_DENIED";
  ImageSelectorErrorType[ImageSelectorErrorType["LIBRARY_PERMISSION_DENIED"] = 101] = "LIBRARY_PERMISSION_DENIED";
  ImageSelectorErrorType[ImageSelectorErrorType["SIMULATOR_ERROR"] = 102] = "SIMULATOR_ERROR";
  ImageSelectorErrorType[ImageSelectorErrorType["SOURCE_TYPE_MISMATCH"] = 103] = "SOURCE_TYPE_MISMATCH";
  ImageSelectorErrorType[ImageSelectorErrorType["FILE_CREATE_ERROR"] = 104] = "FILE_CREATE_ERROR";
  ImageSelectorErrorType[ImageSelectorErrorType["NOT_VALID_PATH"] = 105] = "NOT_VALID_PATH";
  ImageSelectorErrorType[ImageSelectorErrorType["FAIL_TO_PICK_IMAGE"] = 106] = "FAIL_TO_PICK_IMAGE";
  return ImageSelectorErrorType;
}({});
const {
  ImageSelector
} = _reactNative.NativeModules;
var _default = exports.default = ImageSelector;
//# sourceMappingURL=index.js.map