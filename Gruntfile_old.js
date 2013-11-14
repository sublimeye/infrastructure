module.exports = function (grunt) {
	/* Load all tasks from package json */

	require('load-grunt-tasks')(grunt);

	var config = require('load-grunt-config')(grunt, {
		configPath: "tasks/options",
		init: false
	});


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sources: ['src/*.*'],
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['src/js/**/*.js'],
				dest: 'build/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'build/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		qunit: {
			files: ['test/**/*.html']
		},
		jshint: {
			files: ['src/js/libs/*.js'],
			options: {
				force: 'true',
				jshintrc: '.jshintrc',
				reporter: 'checkstyle',
				reporterOutput: 'logs/check-jshint.xml',
			},
		},
		watch: {
			files: ['<%= sources %>'],
			tasks: ['compass']
		},
		compass: {
			dist: {
				options: {
					sassDir: 'src/scss',
					cssDir: 'build',
					environment: 'production'
				}
			},
			dev: {}
		},
		requirejs: {
			compile: {
				options: {
					name: 'index',
					baseUrl: "src/js",
					mainConfigFile: "config.js",
					out: "build/index.build.js",
					optimize: 'uglify2',
					keepBuildDir: true,
					generateSourceMaps: true,
					preserveLicenseComments: false
				}
			}
		}
	});

grunt.registerTask('test', ['jshint']);
grunt.registerTask('default', ['jshint']);
	// grunt.registerTask('default', ['compass', 'concat', 'uglify']);

};