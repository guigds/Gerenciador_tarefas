(function(){
	'use strict';

	angular.module('directivasModule', [])
	.directive('dialog', [function () {
		return {
			restrict: 'A',
			scope : {
				altura : '@',
				largura : '@',
				nomebtn1: '@',
				nomebtn2: '@'
			},
			link: function (scope, iElement, iAttrs) {
				var btn1 = scope.nomebtn1 || 'Ok';
				var btn2 = scope.nomebtn2 || 'Cancelar';
				iElement.dialog({
					autoOpen: false,
      				height: scope.altura || 300,
      				width:  scope.largura || 350,
     			    modal: true,
     			    buttons : {
     			    	Salvar  : function () {
     			    		$(this).dialog('open');
     			    	},
     			    	Cancelar : function() {
     			    		$(this).dialog('close');
     			    	}
     			    }
				});
			}	
		};
	}])
	.directive('overwriteEmail', function() {
	  var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@example\.com$/i;

	  return {
	    require: 'ngModel',
	    restrict: '',
	    link: function(scope, elm, attrs, ctrl) {
	      // only apply the validator if ngModel is present and Angular has added the email validator
	      if (ctrl && ctrl.$validators.email) {

	        // this will overwrite the default Angular email validator
	        ctrl.$validators.email = function(modelValue) {
	          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
	        };
	      }
	    }
	  };
	});
})();