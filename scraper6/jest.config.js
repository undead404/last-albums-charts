/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  moduleFileExtensions: ['js', 'ts'],
  resolver: 'ts-jest-resolver',
  rootDir: './',
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};
