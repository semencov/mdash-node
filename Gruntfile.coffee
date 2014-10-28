'use strict'

module.exports = (grunt) ->

  # load all grunt tasks
  (require 'matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  _ = grunt.util._
  path = require 'path'

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffeelint:
      gruntfile:
        src: '<%= watch.gruntfile.files %>'
      lib:
        src: '<%= watch.lib.files %>'
      test:
        src: '<%= watch.test.files %>'
      options: grunt.file.readJSON('.coffeelintrc')
    coffee:
      lib:
        expand: true
        cwd: 'src/lib/'
        src: ['**/*.coffee']
        dest: 'out/lib/'
        ext: '.js'
      test:
        expand: true
        cwd: 'src/test/'
        src: ['**/*.coffee']
        dest: 'out/test/'
        ext: '.js'
    simplemocha:
      all:
        src: [
          'node_modules/should/should.js'
          'out/test/**/*.js'
        ]
        options:
          globals: ['should']
          timeout: 3000
          ignoreLeaks: false
          ui: 'bdd'
          reporter: 'spec'
    watch:
      options:
        spawn: false
      gruntfile:
        files: 'Gruntfile.coffee'
        tasks: ['coffeelint:gruntfile']
      lib:
        files: ['src/lib/**/*.coffee']
        tasks: ['coffeelint:lib', 'coffee:lib']
      test:
        files: ['src/test/**/*.coffee']
        tasks: ['coffeelint:test', 'coffee:test']
    clean: ['out/']

  grunt.event.on 'watch', (action, files, target) ->
    grunt.log.writeln "#{target}: #{files} has #{action}"

    # coffeelint
    grunt.config ['coffeelint', target], src: files

    # coffee
    coffeeData = grunt.config ['coffee', target]
    files = [files] if _.isString files
    files = files.map (file) -> path.relative coffeeData.cwd, file
    coffeeData.src = files

    grunt.config ['coffee', target], coffeeData

  # tasks.
  grunt.registerTask 'compile', [
    'coffeelint'
    'coffee'
  ]

  grunt.registerTask 'test', [
    'simplemocha'
  ]

  grunt.registerTask 'default', [
    'compile'
    'test'
  ]

