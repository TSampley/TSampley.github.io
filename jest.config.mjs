
export default {
  testEnvironment: "node",
  transform: {},
  testPathIgnorePatterns: [
    '_.*'
  ],
  coverageDirectory: "./_coverage/",
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  }
}
