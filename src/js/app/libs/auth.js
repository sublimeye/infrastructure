define(['./ui', './calc', './console', './docs', './math'], function(ui, calc, con, docs, math) {
	for (var i = 0; i < arguments.length; i++) {
		console.log(arguments[i].say);
	}
	return {
		say: "Hello in auth"
	}
});