(function(){
	'use strict';

	/**
	*  Module
	*
	* Description
	*/
	angular.module('tarefaModule', [])
	.controller('tarefaController', tarefaController);


	tarefaController.$injector = ['$rootScope', '$scope','$location', 'urlParamns', '$http'];

	function tarefaController($rootScope, $scope, $location, urlParamns, $http){
		console.log('Criar Tarefa');
		var vm = this;

		kendo.culture("pt-BR"); 

		vm.categoria = urlParamns.get('categoriaSelecionada'); 
		vm.usuarioLogado = urlParamns.get('usuarioLogado');
		vm.tarefa = {};
		vm.tarefas = [];
		vm.mensagem = {};

		(function () {

			console.log(urlParamns.get('categoriaSelecionada'));
			console.log(vm.usuarioLogado);
			if( urlParamns.get('usuarioLogado') === undefined){
				$location.path('/');
			}else{
				listarTarefas();	
			}

		})();

		function abrirDialog(item){

			if(item !== ''){
				console.log(item)
				vm.tarefa = item;
				vm.alteracao = true;
			}else{
				vm.alteracao = false;
			}

			$scope.winTrf.open();
			$scope.winTrf.center();
		}

		function salvar(){
			console.log(vm.tarefa);
			if(vm.alteracao){
				alterar();
			}else{
				console.log(vm.tarefa);
				adicionar();
			}

			$scope.winTrf.close();
			
		}

		function adicionar(){
			
			vm.tarefa.categoria = vm.categoria.categoria;
			vm.tarefa.usuario = vm.usuarioLogado.usuario[0][1];
			console.log(vm.tarefa);
			$http.put('/aplicativos/api_trf/v2/cadastrar/tarefa', vm.tarefa)
			.success(function(response){
				console.log(response);
				vm.mensagem = '';
				vm.mensagem = {error: response.error, info: true, mensagem: response.mensagem};
				if(!response.error){
					listarTarefas();	
				}
				
			});
		}

		function alterar(){
			var item = vm.tarefa;
			console.log(item);
			$http.put('/aplicativos/api_trf/v2/alterar/tarefa',item)
			.success(function(response){
				vm.mensagem = '';

				console.log(response);

				vm.mensagem = {error: response.error, info: true, mensagem: response.mensagem};
				$scope.winTrf.close();
				listarTarefas();
			});
		}

		function excluir (){

			$http.put("/aplicativos/api_trf/v2/excluir/tarefa", vm.categoria)
			.success(function(response){

				console.log(response.error);

				vm.mensagem = '';
				vm.mensagem = {error: response.error, info:response.error, text:response.mensagem};

				if(!response.error){
					listarTarefas();
				}

			});

			$scope.winTrfConfir.close();
		}

		function voltar(){

			$location.path('/tpl/home');

		}

		function abrirDialogExclusao(item){
			console.log(item);
			vm.categoria = item;
			$scope.winTrfConfir.open();
			$scope.winTrfConfir.center();
		}		

		function listarTarefas(){

			$http.get('/aplicativos/api_trf/v2/listar/tarefas', {params:vm.categoria})
			.then(function(response){
				console.log(response.data.tarefas);
				if (response.data.error){
					console.log('deu error!');
					vm.mensagem = {error: true, text: response.data.mensagem};
					
				} else {
					console.log('não deu error!');
					vm.tarefas = response.data.tarefas;

					vm.tarefas.forEach(function(elem,index){
						vm.tarefas[index] = {id:elem[0],nome:elem[1],descricao:elem[2],prioridade:elem[3],dtInicio:elem[4],dtFinal:elem[5],categoria:elem[6],usuario:elem[7]};
					});

				}
				
			});
		}

		vm.alterar = alterar;
		vm.excluir = excluir;	
		vm.salvar = salvar;
		vm.abrirDialogExclusao = abrirDialogExclusao;
		vm.abrirDialog = abrirDialog;
		vm.voltar = voltar;
	}	
})();