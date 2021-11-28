const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        production: false,
        API: "http://localhost:3008", // API url
        URL: "http://localhost:3000", // interface/frontend url
      },
    };
  }

  return {
    production: true,
    API: "http://localhost:3008", // API url
    URL: "http://localhost:3000", // interface/frontend url
  };
};
