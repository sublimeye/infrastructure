var tests = [];
for (var file in window.__karma__.files) {
  if (/test\.js$/.test(file)) {
    // Convert url of file to its module id.
    // var filename = file.replace(/^\/base/, '../..').replace(/\.js$/, '');
    tests.push(file);
  }
}

requirejs.config({
    baseUrl: '/base/src/js/',

    paths: {
        'jquery': 'src/js/vendor/jquery',
        'underscore': 'src/js/vendor/underscore',
        'app': 'app',
        'vanilla': 'app/vanilla'
    },

    shim: {
         'underscore': {
            exports: '_'
        }        
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: function(){
			window.app = {};
			window.__karma__.start();
		}
});