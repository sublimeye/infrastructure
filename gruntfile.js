module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sources: ['src/*.*'],
		dirs: {
			sources: 'src/',
			reports: 'reports/',
			build: 'build/'
		},
		files: {
			js: ['<%= dirs.sources %>js/libs/*.js', '<%= dirs.sources %>js/vanilla/*.js']
		},
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
		jshint: {
			files: ['<%= files.js %>'],
			options: {
				force: 'true',
				jshintrc: '.jshintrc',
				reporter: 'checkstyle',
				reporterOutput: 'reports/jshint-checkstyle.xml'
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc',
				formatters: [
					{id: 'csslint-xml', dest: 'reports/csslint.xml'},
					{id: 'checkstyle-xml', dest: 'reports/csslint-checkstyle.xml'}
				]
			},
			defaut: {
				src: ['build/*.css']
			}
		},
		watch: {
			styles: {
				files: ['src/*.*'],
				tasks: ['compass']
			},
			options: {
				debounceDelay: 200
			}
		},
		compass: {
			options: {
				sassDir: 'src/scss',
				cssDir: 'build',
				debugInfo: true
			},
			prod: {
				options: {
					environment: 'production'
				}
			},
			debug: {
				options: {
					environment: 'development'
				}
			}
		},
		plato: {
			options: {
				jshint: false
			},
			metrix: {
				files: {
					'reports/plato': '<%= files.js %>'
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					name: 'index',
					baseUrl: "src/js",
					mainConfigFile: "config.js",
					out: "build/index.min.js",
					optimize: 'uglify2',
					keepBuildDir: true,
					generateSourceMaps: true,
					preserveLicenseComments: false
				}
			}
		},
		concurrent: {
			buildProd: [
				'plato',
				'csslint',
				'buildScripts:prod',
				'buildStyles:prod'
			],

			buildDebug: [
				'buildStyles:debug',
				'buildScripts:debug'
			]
		}
	});

	grunt.registerTask('build:prod', [
		'jshint',
		'concurrent:buildProd'
		// build js

		// metrics plato
		// metrics jshint
		// metrics csslint

		//
	]);

	grunt.registerTask('build:debug', [
		// run local server for tests, livereload
		'concurrent:buildDebug'
		// watch tests

		// watch build css:dev
		// watch build js:dev
	]);

	grunt.registerTask('work', [        // alias 'watch'
		// run local server for tests, livereload
		// watch tests
		'watch'
		// watch build css:dev
		// watch build js:dev
	]);


	/*  Helper tasks
	 * ====================*/
	grunt.registerTask('buildScripts:debug', [
	]);

	grunt.registerTask('buildScripts:prod', [
		'concat',
		'uglify'
		// if Require -> run requireJs
	]);

	grunt.registerTask('buildStyles:debug', [
		'compass:debug'
	]);

	grunt.registerTask('buildStyles:prod', [
		'compass:prod'
	]);

/*
	grunt.registerTask('buildTemplates', [
		// handlebars , jade, emblem
	]);
*/

/*

	*/
/* temp task *//*

	grunt.registerTask('default', [
		'plato',        // create plato metrics
		'compass',      // process scss, concat, minify
		'jshint',       // jshint, generate reports
		'force:on',     // "force": turn on force mode
		'csslint',      // csslint, generate reports
		'force:restore' // "force": restore
		// run tests
	]);
*/


	/* Helper --FORCE task */
	/* It set or unset force flag in grunt and should be used for certain tasks */
	var previous_force_state = grunt.option("force");
	grunt.registerTask("force", function (set) {
		if (set === "on") {
			grunt.option("force", true);
		}
		else if (set === "off") {
			grunt.option("force", false);
		}
		else if (set === "restore") {
			grunt.option("force", previous_force_state);
		}
	});


};