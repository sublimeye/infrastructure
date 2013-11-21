module.exports = function (grunt) {

	/**
	 * Load all grunt-* tasks from the package.json
	 */
	require('load-grunt-tasks')(grunt, {pattern: 'grunt-*'});

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

		userScripts: ['<%=scriptsDir%>/app/**/*.js', '<%=scriptsDir%>/*.js'],
		scriptsCompiled: ['<%=compiledDir%>/**/*.js'],

		testBase: ['<%=testsDir%>', '<%=srcDir%>'],

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
				reporter: 'jslint',
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
				configFile: 'karma.conf.js'
				// frameworks: ['mocha', 'requirejs', 'chai'],
				// files: [
				// 	{pattern: 'src/js/**/*.js', included: false},
				// 	{pattern: 'test/js/**/*.js', included: false},
				// 	'test-main.js'
				// 	],
				// exclude: ['src/js/index.js'],
				// reporters: ['dots'],
				// browsers: ['Chrome'],
				// runnerPort: 9876,
			},
			unit: {
				browsers: ['Chrome'],
				background: true
			},
			prod: {
				browsers: ['PhantomJS'],
				singleRun: true,
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
				debouceDelay: 200,
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
	grunt.registerTask('default', ['work']);

	grunt.registerTask('build:prod', 'Compile, compress, get metrics. Used by CI and dev', [
		'_critical:prod',
		'_compile:prod',
		'_metrics:prod',
		'_test:prod'
	]);

	grunt.registerTask('_critical:prod', 'Run critical issues checker', [
		'jsvalidate'
	]);

	grunt.registerTask('_compile:prod', 'compile js, css, templates', [
		'requirejs:prod',
		'compass:prod'
	]);

	grunt.registerTask('_metrics:prod', 'run all possible metrics and generate reports', [
		'force:on',
		'sloc',
		'jshint',
		'csslint:prod',
		'complexity',
		'plato',
		'force:off'
	]);

	grunt.registerTask('_test:prod', 'run all possible metrics and generate reports', [
		'force:on',
		'karma:prod',
		'force:off'
	]);

/*
	grunt.registerTask('build:dev', 'Compile, compress, run metrics', [
	]);
*/

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

};