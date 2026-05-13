/** @type {import('detox').DetoxConfig} */
module.exports = {
	testRunner: {
		args: {
			$0: "jest",
			config: "e2e/jest.config.js",
		},
		jest: {
			setupTimeout: 120000,
		},
	},
	apps: {
		"ios.debug": {
			type: "ios.app",
			binaryPath:
				"ios/build/Build/Products/Debug-iphonesimulator/PlateMobile.app",
			build:
				"xcodebuild -workspace ios/PlateMobile.xcworkspace -scheme PlateMobile -configuration Debug -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 16 Pro,OS=18.5' -derivedDataPath ios/build ONLY_ACTIVE_ARCH=YES ARCHS=arm64",
		},
		"android.debug": {
			type: "android.apk",
			binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
			testBinaryPath:
				"android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk",
			build:
				"cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug",
		},
	},
	devices: {
		simulator: {
			type: "ios.simulator",
			device: {
				type: "iPhone 16 Pro",
			},
		},
		emulator: {
			type: "android.emulator",
			device: {
				avdName: "Pixel_6_API_34",
			},
		},
	},
	configurations: {
		"ios.sim.debug": {
			device: "simulator",
			app: "ios.debug",
		},
		"android.emu.debug": {
			device: "emulator",
			app: "android.debug",
		},
	},
};
