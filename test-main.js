var tests = Object.keys(window.__karma__.files).filter(function (file) {
    return /test\.js$/.test(file);
});

requirejs.config({
    baseUrl: '/base/src/js/',

    paths: {
        'jquery': 'src/js/vendor/jquery',
        'underscore': 'src/js/vendor/underscore',
        'app': 'app',
        'vanilla': 'app/vanilla',
        'libs': 'app/libs'
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