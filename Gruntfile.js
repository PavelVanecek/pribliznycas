// inspired by http://www.thomasboyt.com/2013/09/01/maintainable-grunt.html
var fs = require('fs')

function loadConfig(path, grunt) {
  const object = {}
  fs.readdirSync(path).forEach(function(option) {
    const key = option.replace(/\.js$/, '')
    const config = require(path + option)
    if ('function' === typeof config) {
      return object[key] = config(grunt)
    } else {
      return object[key] = config
    }
  })
  return object
}

module.exports = function(grunt) {
  const baseConfig = {
    pkg: grunt.file.readJSON('package.json'),
    env: 'production'
  }
  const config = Object.assign(baseConfig, loadConfig('./tasks/options/', grunt))
  grunt.initConfig(config)
  require('load-grunt-tasks')(grunt)
  return grunt.loadTasks('tasks')
}
