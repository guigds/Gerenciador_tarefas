(function(){
	'use strict';

	angular.module('homeModule', [])
	.controller('homeController', homeController);

	homeController.$injector = ['$scope', '$rootScope', '$location','$http', 'urlParamns'];

	function homeController($scope, $rootScope, $location, $http,urlParamns){
		console.log('Home controller');

		var vm = this;
		vm.categoria = {};
		vm.categoriaSelecionada = {};
		vm.categorias = [];
		vm.msg = {error:false, info:false};
		vm.usuarioLogado = urlParamns.get('usuarioLogado');

		(function(){
			console.log('chamando lista');
			console.log(urlParamns.get('usuarioLogado'));
			
			if(urlParamns.get('usuarioLogado') === undefined){
				$location.path('/');
			}else{
				listaDeCategoria();
			}

		})();

		//Selecionar item
		function linhaSelecionada(item){

			$location.path('/tpl/tarefas');
			vm.categoriaSelecionada = item;
			urlParamns.add('categoriaSelecionada', {categoria:item[0],nome:item[1],usuario:item[2]});

		}

		function listaDeCategoria () {
			vm.msg = {error:false, info:false};

			$http.get('http://localhost:80/aplicativos/api_trf/v2/listar/categorias',{params: {usuario:vm.usuarioLogado.usuario[0][1]}})
			.then(function(response){
				console.log(response.data);

				if(response.data.error){
					vm.msg.error = response.data.error;
					vm.mensagem = response.data.mensagem;
				} else {
					vm.msg.info = response.data.error;
					vm.categorias = response.data.categorias;	
				}

			});
		}

		//Abre dialog
		//IF ITEM SELECIONADO POPULA CAMPO
		//ELSE NÃO POPULA
		function abrirDialog (item) {
			console.log('abrir Dialog');
			vm.categoria = {};
			vm.nomeCategoria = '';


			//Verfica se é pra alterar ou adicionar catagoria
			if(item !== ''){

				vm.nomeCategoria = item[1];
				vm.categoria = {id : item[0], nome: item[1], usuario : item[2]};
			} 

			$scope.winCategoria.open();
			$scope.winCategoria.center();
			// directive que abre o dialog
			//dialogService.open('#dgnctg');
		}	


		function abrirDialogExclusao(item){
			console.log('dialog exclusão');
			
			vm.categoria = {id: item[0], usuario: item[2]};
			console.log(vm.categoria);

			$scope.winCategoriaConfir.open();
			$scope.winCategoriaConfir.center();
		}

		function salvarCategoria (){

			if(vm.categoria.id !== undefined){
				
				vm.categoria.nome = vm.nomeCategoria;

				$http.put('/aplicativos/api_trf/v2/alterar/categoria', vm.categoria)
				.success(function(response){
					console.log(response);
					listaDeCategoria();
					$scope.winCategoria.close();
					vm.mensagem = "Alteração realizada com sucesso!";
				}).error(function(){
					console.log("error");
				});

			}else{

				console.log(vm.usuarioLogado);
				vm.categoria = {nome:vm.nomeCategoria,usuario:vm.usuarioLogado.usuario[0][1]};
				$http.put('/aplicativos/api_trf/v2/cadastrar/categoria', vm.categoria)
				.then(function(response){
					listaDeCategoria();
					$scope.winCategoria.close();
					vm.mensagem = "Inclusão realizada com sucesso!";
				});	
				
			}

		}
		
		function excluirCategoria(){

			$http.put("/aplicativos/api_trf/v2/excluir/categoria", vm.categoria)
			.success(function(response){
				console.log(response);
				$scope.winCategoriaConfir.close();
				listaDeCategoria();
				vm.msg.info = true;
				vm.mensagem = 'Exclusão realizada com sucesso!';
			})
			.error(function(response){
				console.log(response);
			});
		}

		vm.excluirCategoria = excluirCategoria;
		vm.abrirDialogExclusao = abrirDialogExclusao;
		vm.salvarCategoria	= salvarCategoria;
		vm.linhaSelecionada = linhaSelecionada;
		vm.abrirDialog 		= abrirDialog;
	}

})();