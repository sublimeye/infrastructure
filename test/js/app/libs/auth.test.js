define(function (require) {
	var auth = require('libs/auth');

	describe('Auth', function () {

		it('Should have say method: ', function () {
			should.exist(auth.say);
		});

	});

});
