module.exports = {
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  coverageReporters: ["clover", "json", "lcov", ["text", { skipFull: true }]],
};
