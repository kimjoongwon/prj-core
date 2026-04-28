const { TextDecoder, TextEncoder } = require("node:util");
const { URL, URLSearchParams } = require("node:url");

Object.defineProperties(globalThis, {
	TextDecoder: {
		configurable: true,
		value: TextDecoder,
		writable: true,
	},
	TextDecoderStream: {
		configurable: true,
		value: class TextDecoderStream {},
		writable: true,
	},
	TextEncoderStream: {
		configurable: true,
		value: class TextEncoderStream {},
		writable: true,
	},
	TextEncoder: {
		configurable: true,
		value: TextEncoder,
		writable: true,
	},
	URL: {
		configurable: true,
		value: URL,
		writable: true,
	},
	URLSearchParams: {
		configurable: true,
		value: URLSearchParams,
		writable: true,
	},
	structuredClone: {
		configurable: true,
		value: (value) => JSON.parse(JSON.stringify(value)),
		writable: true,
	},
});

Object.defineProperty(globalThis, "__ExpoImportMetaRegistry", {
	configurable: true,
	enumerable: false,
	value: {
		get url() {
			return "";
		},
	},
	writable: true,
});
