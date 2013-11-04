var assert = require("assert");

describe('Controller', function () {
	describe('Constructor', function(){
		var c = new window.app.Controller();

		it('should have constant ENTER_KEY === 13', function () {
			assert.equal(13, c.ENTER_KEY);
		});

		it('should have constant ENTER_KEY === 13', function () {
			assert.equal(27, c.ESCAPE_KEY);
		});
	});
});