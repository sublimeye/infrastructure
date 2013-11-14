module.exports = function (grunt) {
	  // Loads task options from `tasks/options/`
	  // and loads tasks defined in `package.json`
	  var config = require('load-grunt-config')(grunt, {
	  	configPath: "tasks/options",
	  	init: false
	  });

	  // Loads tasks in `tasks/` folder
	  grunt.loadTasks('tasks'); 

	  grunt.initConfig(config);

	  /* Main grunt tasks. Should be used from CLI, e.g. $grunt test   OR   $grunt dist */
	  grunt.registerTask('default', ['jshint']);

	  grunt.registerTask('dev', 'Run grunt in development mode. Start local server with tests results / stats / ...?', ['']);
	  grunt.registerTask('prod', 'Build a production version & generate logs', ['jshint']);

};