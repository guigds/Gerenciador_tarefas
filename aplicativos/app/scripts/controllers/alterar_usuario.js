(function(){
	'use strict';

	angular.module('alterarUsuarioModule', [])
	.controller('alterarUsuarioController', alterarUsuarioController );

	alterarUsuarioController.$injector = ['$rootScope','$scope','$location'];

	function alterarUsuarioController($rootScope, $scope, $location){
		console.log('alterar usuario')

		var vm = this;
		vm.usuario = {nome:'Taref', email:'taref@email.com',usuario:'taref'};
		vm.validSenha = false;
		vm.usuarioExistente = false;
		vm.mensagem = '';

		function cadastrar(){
			vm.mensagem = '';

			if(vm.usuarioExistente){
				vm.mensagem = 'Usuário já existente especifique outro.';
			
			}else if(vm.usuario.confSenha !== vm.usuario.senha){
				vm.mensagem = 'Confirmação de senhas não está igual a senha informada.';
				vm.validSenha = true;

			}else {
				vm.validSenha = false;
				vm.usuarioExistente = false;
			}

		}

		vm.cadastrar = cadastrar;
	}
})();