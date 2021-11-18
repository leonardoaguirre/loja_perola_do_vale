const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        production: false,
        API: 'http://localhost:3008',
      }
    }
  }

  return {
    production: true,
    API: 'http://localhost:3008'
  }
}