(function(){
	'use strict';

	angular.module('ModuloLoginController',[])
	.controller('loginController', loginController);

	loginController.$injector = ['$scope', '$location', '$rootScope', 'urlParamns','$http'];

	function loginController ($scope, $location, $rootScope, urlParamns, $http){
		var vm = this;
		console.log('LoginController');
		vm.mensagem = '';
		vm.usuario = {login:'',senha:''};
		
		function logar(){
			console.log('logar');
			vm.autenticacao = false;
			vm.mensagem = '';

			$http.post('/aplicativos/api_trf/v2/autenticar',vm.usuario)
			.success(function(response){

				console.log(response);

				if(response.error){
					vm.mensagem = response.mensagem;
				}else{
					vm.autenticacao = true;
					urlParamns.add('usuarioLogado', response);
					$location.path('/tpl/home');
				}
					

			}).error(function(response){
				console.log(response);
			});

			//$location.path('/tpl/home');
		}

		vm.logar = logar;


	}	
})();

