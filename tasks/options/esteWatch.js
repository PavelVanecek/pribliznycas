module.exports = function(grunt) {
  return {
    options: {
      dirs: ['{js,css,html}/**/'],
      livereload: {
        enabled: true,
        port: 35729,
        extensions: ['js', 'css', 'html']
      },
      beep: true
    },
    coffee: function(filepath) {
      const files = [
        {
          expand: true,
          src: filepath,
          ext: '.js'
        }
      ]
      grunt.config(['coffee', 'default', 'files'], files)
      return ['coffee']
    },
    jade: function(filepath) {
      grunt.config(['template'], filepath)
      return ['template']
    },
    styl: function(filepath) {
      grunt.config(['stylus', 'default', 'files'], [
        {
          expand: true,
          src: filepath,
          ext: '.css'
        }
      ])
      return ['stylus']
    },
    css: function(filepath) {
      if (grunt.option('stage')) {
        return 'cssmin'
      }
    }
  }
}
