define(function (require) {
	var Controller = require('vanilla/model');

	describe('App Model Test Suite', function () {


		describe('Basic behavior', function () {
			var m = window.app;

			it('Model should have a window', function () {
				assert(12 == 12, '10 yes');
			});

			it('Model: 15 == 15', function () {
				assert(15 == 15, '10 yes');
				assert(15 == 15, '10 yes');
			});
		});

	});

});