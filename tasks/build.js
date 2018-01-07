module.exports = function(grunt) {
  return grunt.registerTask('build', [
    // delete all generated files
    'clean',

    // minify css
    'cssmin',

    // minify JS
    'uglify',

    // minify html
    'htmlmin',

    // delete temporary files
    'clean:temp'
  ])
}
