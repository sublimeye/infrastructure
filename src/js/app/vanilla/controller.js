define(function(require) {
	return (function (window) {
		'use strict';

		/**
		 * Takes a model and view and acts as the controller between them
		 *
		 * @constructor
		 * @param {object} model The model constructor
		 * @param {object} view The view constructor
		 */
		function Controller (model, view) {
			this.model = model;
			this.view = view;

			this.ENTER_KEY = 13;
			this.ESCAPE_KEY = 27;
			this.NEW_KEY = 100;
		}

		/**
		 * A getter for getting the current page
		 */
		Controller.prototype._getCurrentPage = function () {
			return document.location.hash.split('/')[1];
		};

		// Export to window
		return Controller;
	})(window);
});
