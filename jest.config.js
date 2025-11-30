module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.spec.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main.js',
    '!src/router/index.js'
  ],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.js$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }]
      ]
    }]
  },
  transformIgnorePatterns: [
    'node_modules/'
  ]
};
