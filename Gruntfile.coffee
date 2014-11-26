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
      options: grunt.file.readJSON('.coffeelintrc')
    coffee:
      options:
        bare: true
        expand: true
      lib:
        cwd: 'src/'
        files:
          'lib/mdash.js': [
            'src/lib/mdash.coffee'
            'src/lib/mdash.lib.coffee'
            'src/lib/mdash.tret.coffee'
            'src/lib/mdash.tret.*.coffee'
          ]

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

    mochaTest:
      spec:
        options:
          reporter: 'spec'
          require: 'coffee-script/register'
        src: ['test/**/*.coffee']
      md:
        options:
          reporter: 'Markdown'
          require: 'coffee-script/register'
          quiet: true
          captureFile: 'report.md'
        src: ['test/**/*.coffee']

    watch:
      options:
        spawn: false
      gruntfile:
        files: 'Gruntfile.coffee'
        tasks: ['coffeelint:gruntfile']
      lib:
        files: ['src/lib/**/*.coffee']
        tasks: ['coffeelint:lib', 'coffee:lib']
    clean: ['out/']

  grunt.event.on 'watch', (action, files, target) ->
    grunt.log.writeln "#{target}: #{files} has #{action}"

    # coffeelint
    # grunt.config ['coffeelint', target], src: files

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

