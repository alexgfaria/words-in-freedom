const serve = require('webpack-serve')
const argv = {}
const config = require('./webpack.config.js')

serve(argv, { config }).then((result) => {
  // ...
})