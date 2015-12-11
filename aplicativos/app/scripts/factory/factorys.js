(function (argument){
	'use strict';

	angular.module('factryModule', [])
	.factory('urlParamns', [function() {

        var urlParamns = []

        function get(id){
            return urlParamns[id];
        }

        function add(id, item){
            urlParamns[id] = item;
        }


        return {
            add: add,
            get: get
        };

    }]);


})();