const { defineConfig } = require("cypress");

module.exports = defineConfig({ 
  env: {
  apiUrl: "http://localhost:3002/api"
},
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
