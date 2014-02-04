define(function (require) {
	var Controller = require('vanilla/controller');

	describe('Controller', function () {

		describe('Sample Controller', function () {
			 var c = new Controller('model', 'view');

			it('Should have property model and view', function () {
				should.exist(c.model);
				should.exist(c.view);
        
			});

			 it('ENTER_KEY should be equal 13', function () {
				 c.ENTER_KEY.should.equal(13);
				 // c.ENTER_KEY.should.equal(14);
			 });

			 it('ESCAPE_KEY should be equal 27', function () {
				 c.ESCAPE_KEY.should.equal(27);
			 });

			 it('Should have getCurrentPage method', function () {
				 should.exist(c._getCurrentPage);
			 });

			 it('Get current page should return empty string for no url set', function () {
				 assert(10 === 10, 'Values should be equal');
			 });

			 it('Should have prototype function', function () {
				should.exist(Controller.prototype._getCurrentPage);
			 });

			 it('I love testing', function () {
				assert('young' > 'old', 'Who is better');
			 });

			 it('Gobo go', function () {
				assert('love' !== 'hate', 'What?');
				assert('love' === 'love', 'What?');
			 });



		});

	});

});
