require("dotenv").config();

module.exports = {
  env: {
    API_URL: process.env.API_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
};
