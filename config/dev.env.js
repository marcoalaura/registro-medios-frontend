'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"http://localhost:3000/api/v1/"',
  GRAPHQL_URL: '"http://localhost:3000/graphql/"',
  AUTH_URL: '"http://localhost:3000/auth"',
  ONBEFOREUNLOAD: false,
  DEBUG_MODE: true
})
