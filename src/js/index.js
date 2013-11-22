require(['app/libs/auth'], function(auth) {
	debugger;
	console.log(auth.say + 'do it!');

	var o = {}
	for (var j = 0; j<10; j++) {
		o[j] = function(j) {
			return j;
			// new anonymous function , jshint should show a warning
		}
	}
});