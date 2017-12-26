// inspired by http://www.thomasboyt.com/2013/09/01/maintainable-grunt.html
var fs = require('fs')

function loadConfig(path, grunt) {
  var object = {}
  fs.readdirSync(path).forEach(function(option) {
    var config, key
    key = option.replace(/\.coffee$/, '')
    config = require(path + option)
    if ('function' === typeof config) {
      return object[key] = config(grunt)
    } else {
      return object[key] = config
    }
  })
  return object
}

module.exports = function(grunt) {
  var baseConfig, config
  baseConfig = {
    pkg: grunt.file.readJSON('package.json'),
    env: process.env
  }
  config = grunt.util._.extend(baseConfig, loadConfig('./tasks/options/', grunt))
  grunt.initConfig(config)
  require('load-grunt-tasks')(grunt)
  return grunt.loadTasks('tasks')
}
