module.exports = function (grunt) {

	// Displays the elapsed execution time of grunt tasks when done
	require('time-grunt')(grunt);

	var config = {
		pgk: grunt.file.readJSON('package.json'),

		/* Sources / folder structure configuration */
		srcDir: 'src',
		compiledDir: 'dist',
		reportsDir: 'reports',
		testsDir: 'test',

		scriptsDir: 'src/js',
		stylesDir: 'src/scss',
		imagesDir: 'src/img',
		fontsDir: 'src/fonts',

		stylesCompiledDir: '<%=compiledDir%>/css',
		scriptsCompiledDir: ['<%=compiledDir%>/js'],

		styles: ['<%=stylesDir%>/**/*.*'],
		stylesCompiled: [ '<%= stylesCompiledDir %>/*.css'],

		userScripts: ['<%=scriptsDir%>/app/**/*.js', '!<%=scriptsDir%>/vendor/**/*.js'],
		scriptsCompiled: ['<%=compiledDir%>/**/*.js'],

//		testBase: ['<%=testsDir%>', '<%=srcDir%>'],

		/* Metrics configuration */
		jsvalidate: {
			options: {
				globals: {},
				esprimaOptions: {},
				verbose: false
			},
			targetName: {
				files: {
					src: ['<%= userScripts %>']
				}
			}
		},
		jshint: {
			all: {
				src: '<%= userScripts %>'
			},
			options: {
				force: true,
				jshintrc: '.jshintrc',
				reporter: 'checkstyle',
				reporterOutput: '<%=reportsDir%>/report-jshint.xml'
			}
		},
		csslint: {
			prod: {
				src: '<%= stylesCompiled %>',
				options: {
					csslintrc: '.csslintrc',
					formatters: [
						{id: 'lint-xml', dest: '<%=reportsDir%>/report-csslint.xml'}
					]
				}
			},
			dev: {
				src: '<%= stylesCompiled %>',
				options: {
					csslintrc: '.csslintrc'
				}
			}
		},
		complexity: {
			generic: {
				src: '<%=userScripts%>',
				options: {
					jsLintXML: '<%=reportsDir%>/report-complexity.xml', // create XML JSLint-like report
					checkstyleXML: false, //'checkstyle.xml', // create checkstyle report
					errorsOnly: false, // show only maintainability errors
					cyclomatic: 11,
					halstead: 8,
					maintainability: 100
				}
			}
		},
		sloc: {
			metrix: {
				options: {
					reportType: 'json',
					reportPath: '<%=reportsDir%>/report-sloc.json',
					tolerant: true
				},
				files: {
					'./': '<%=userScripts%>'
				}
			}
		},
		plato: {
			options: {
				jshint: false
			},
			metrix: {
				files: {
					'reports/plato': '<%= userScripts %>'
				}
			}
		},

		/* processing & compiling */
		compass: {
			options: {
				sassDir: '<%= stylesDir %>',
				cssDir: '<%= stylesCompiledDir %>',
				imagesDir: '<%=imagesDir%>',
				fontsDir: '<%=fontsDir%>'
				/* Compass doesn't support SourceMaps yet 8/Nov/2013 (c) RM */
			},
			prod: {
				options: {
					environment: 'production',
					outputStyle: 'compressed',
					force: true
				}
			},
			dev: {
				options: {
					environment: 'development'
				}
			}
		},
		/* r.js optimizer configuration: https://github.com/jrburke/r.js/blob/master/build/example.build.js */
		requirejs: {
			prod: {
				options: {
					optimizeCss: 'none',
					mainConfigFile: "<%=scriptsDir%>/require.conf.js",

					name: 'index',
					baseUrl: '<%=scriptsDir%>',
					out: "<%=scriptsCompiledDir%>/index.min.js",
					optimize: 'uglify2',

					//The directory path to save the output. If not specified, then
					//the path will default to be a directory called "build" as a sibling
					//to the build file. All relative paths are relative to the build file.
//					dir: '<%=compiledDir%>',

					//Finds require() dependencies inside a require() or define call. By default
					//this value is false, because those resources should be considered dynamic/runtime
					//calls. However, for some optimization scenarios, it is desirable to
					//include them in the build.
					findNestedDependencies: true,

					//If set to true, any files that were combined into a build bundle will be removed from the output folder.
					removeCombined: true,

					// the dir above will be deleted before the build starts again. If you have a big build and are not doing
					// source transforms with onBuildRead/onBuildWrite, then you can
					// set keepBuildDir to true to keep the previous dir.
					keepBuildDir: true,

					generateSourceMaps: false,
					preserveLicenseComments: false
				}
			},
			dev: {
			}
		},

		/* Server , tests automation */
		karma: {
			options: {
				reportSlowerThan: 0,
				runnerPort: 9999,
				port: 9988,

				basePath: './',
				frameworks: ['mocha', 'requirejs', 'chai'],
				files: [
					'test-main.js',
					{pattern: 'src/js/**/*.js', included: false},
					{pattern: 'test/js/**/*.js', included: false}
				],
				exclude: ['src/js/index.js'],
				junitReporter: {
					outputFile: '<%=reportsDir%>/report-test-results.xml'
				},
				preprocessors: {
				/*source files, that you wanna generate coverage for do not include tests or libraries (these files will be instrumented by Istanbul)*/
					'src/js/app/**/*.js': ['coverage']
				},
				coverageReporter: {
					type : ['cobertura'],
					dir : '<%=reportsDir%>/test-coverage/'
				}
			},
			unit: {
				reporters: ['progress'],
				browsers: ['PhantomJS'],
				logLevel: 'WARN',
				background: true
			},
			prod: {
				reporters: ['dots', 'coverage', 'junit'],
				browsers: ['PhantomJS'],
				logLevel: 'ERROR',
				singleRun: true,
				captureTimeout: 30000,
				force: true
			}
		},

		// grunt-express will serve the files from the folders listed in `bases`
    // on specified `port` and `hostname`
		express: {
			all: {
				options: {
					port: 9000,
					hostname: "0.0.0.0",
					bases: '<%= testBase %>',
					livereload: true
				}
			}
		},

		// grunt-open will open your browser at the project's URL
		open: {
			all: {
				// Gets the port from the connect configuration
				path: 'http://localhost:<%= express.all.options.port %>'
			}
		},

		/* Watcher */
		watch: {
			scripts: {
				files: '<%= userScripts %>'
			},

			styles: {
				files: '<%= styles %>',
				tasks: ['compass:dev']
			},

			options: {
				debounceDelay: 200,
//				atBegin: true,
				livereload: true
			},

			// run unit tests with karma (server needs to be already running)
			karma: {
				files: ['src/js/**/*.js', 'test/js/**/*.js'],
				tasks: ['karma:unit:run']
			}
		}
	};

	grunt.registerTask('work', '', [
		/* Launches express server
		 * Loads tests/index.html with test results, with livereload script
		 * Reloads the page when 'tests' get changed
		  * */
//		'express',
		/* Opens browser window with localhost/index.html page with tests */
//		'open',
		'karma:unit:start',
		/* Watch sources for changes */
		/* Reloads dashboard page */
		'watch'
	]);
	grunt.registerTask('default', function() {
		grunt.log.writeln('Default task is the same as "grunt work" task');
		grunt.task.run('work');
	}['work']);

	grunt.registerTask('build:prod', 'Compile, compress, get metrics. Used by CI and dev', [
		'_critical:prod',
		'_compile:prod',

		'force:on',
		'_metrics:prod',
		'_test:prod',
		'force:restore'
	]);

	/**
	 * @private
	 * Helper grunt tasks (used by @public main grunt tasks)
	 */
	grunt.registerTask('_critical:prod', 'Run critical issues checker', [
		'jsvalidate'
	]);

	grunt.registerTask('_compile:prod', 'compile js, css, templates', [
		'requirejs:prod',
		'compass:prod'
	]);

	grunt.registerTask('_metrics:prod', 'run all possible metrics and generate reports', [
		'sloc',
		'jshint',
		'csslint:prod',
		'complexity',
		'plato'
	]);

	grunt.registerTask('_test:prod', 'run all possible metrics and generate reports', [
		'karma:prod'
	]);

	grunt.initConfig(config);

/**
 * Grunt Helpers
 * ========================================================================== */

	/**
	 * Special grunt task to turn on/off force property
	 * --force allows to continue tasks even if they fails
	 *
	 * Usage: insert required force triggering task before/after certain tasks.
	 * e.g. ['force:on', 'csslint', 'force:off', 'jshint']
	 *
	 * @link: http://stackoverflow.com/questions/16612495/continue-certain-tasks-in-grunt-even-if-one-fails/16972894
	 */
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

	/**
	 * Load all grunt-* tasks from the package.json
	 */
	require('load-grunt-tasks')(grunt, {pattern: 'grunt-*'});

};