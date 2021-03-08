module.exports = {
  preset: 'ts-jest',
  globals: {
    'vue-jest': {
      pug: {
        doctype: 'html',
      },
    },
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\js$': 'babel-jest',
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  collectCoverage: true,
  collectCoverageFrom: [
    // "**/*.{ts,vue}",
    // "**/src/**/*.{ts,vue}",
    // "**/tests/**/*.{ts,vue}",
    '**/src/components/**/*.{ts,vue}',
    '**/src/views/**/*.{ts,vue}',
    '!**/src/views/Examples.vue',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
  ],
  coverageReporters: [/*'json',*/ 'lcov', 'text' /*'clover'*/],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
