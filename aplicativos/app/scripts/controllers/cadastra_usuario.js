(function(){
	'use strict';

	angular.module('cadastraUsuarioModule', [])
	.controller('cadastraUsuarioController', cadastraUsuarioController );

	cadastraUsuarioController.$injector = ['$rootScope','$scope','$location','$http'];

	function cadastraUsuarioController($rootScope, $scope, $location, $http){
		console.log('cadastrar usuario')

		var vm = this;
		vm.usuario = {};
		vm.validSenha = false;
		vm.usuarioExistente = false;
		vm.mensagem = '';
		vm.cdsucesso = false;

		function cadastrar(){
			

			console.log(vm.usuario);

			if(validaDados()){
				if(vm.usuario.confSenha !== vm.usuario.senha){

					vm.mensagem = 'Confirmação de senhas não está igual a senha informada.';
					vm.validSenha = true;

				}else {

					vm.validSenha = false;

					$http.post('/aplicativos/api_trf/v2/cadastrar/usuario',vm.usuario)
					.success(function(response){
						console.log(response);
						if(response.erro){

							vm.mensagem = response.mensagem;
							vm.validSenha = false;
							vm.usuarioExistente = true;

						} else {

							vm.mensagem = response.mensagem;
							vm.cdsucesso = true;
							$location.path('/');

						}
					});
			
				}	
			}

			limpaAtributos();
		}

		function limpaAtributos(){
			vm.usuario = {};
			vm.validSenha = false;
			vm.usuarioExistente = false;
			vm.mensagem = '';
			vm.cdsucesso = false;
		}

		function validaDados (){
			if(vm.usuario.nome === undefined || vm.usuario.email === undefined || vm.usuario.usuario === undefined || vm.usuario.senha === undefined )
				return false;
			else
				return true;
		}

		vm.cadastrar = cadastrar;
	}
})();