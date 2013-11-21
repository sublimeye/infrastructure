'use strict';

require.config({
    deps: [],
    paths: {
        jquery: 'vendor/jquery',
        van: 'app/vanilla',
        model: 'van/model'
    },
    shim: {
    	'model': {
    		exports: "model"
    	}
    }
});