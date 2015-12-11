(function(){
	'use strict';

	angular.module('recuperaSenhaModule', [])
	.controller('recuperarSenhaController', recuperarSenhaController );

	recuperarSenhaController.$injector = [];

	function recuperarSenhaController(){
		console.log('recupera senha');

		var vm = this;

		function enviar(){
			vm.mensagem = 'Email inválido.';
			vm.emailInvalido = true;
		}

		vm.enviar = enviar;
	}
	  
})();