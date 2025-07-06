module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        target: 'es2017',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        types: ['jest', 'node'],
        skipLibCheck: true,
        strict: false,
        paths: {
          "@shared": ["./shared/index"]
        }
      }
    }],
  },
  maxWorkers: 1,
  testTimeout: 5000,
  forceExit: true,
  detectOpenHandles: true,
};
