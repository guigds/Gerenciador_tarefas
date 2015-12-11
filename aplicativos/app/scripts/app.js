'use strict';

/**
 * @ngdoc overview
 * @name aplicativosApp
 * @description
 * # aplicativosApp
 *
 * Main module of the application.
 */
angular
  .module('aplicativosApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'homeModule',
    'tarefaModule',
    'directivasModule',
    'factryModule',
    'ModuloLoginController',
    'cadastraUsuarioModule',
    'recuperaSenhaModule',
    'alterarUsuarioModule',
    'kendo.directives'

  ])  
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");

    $stateProvider.state('login',{
      url: "/login",
      templateUrl:'views/login.html',
      controller: 'loginController',
      controllerAs: 'ctrl'
    }) 
    .state('template',{
      url: '/tpl',
      templateUrl:'views/templates/template.html'
    })
    .state('template.home',{
      url: '/home',
      templateUrl:'views/home.html',
      controller: 'homeController',
      controllerAs:'ctrl'
    })
    .state('template.tarefas',{
      url: '/tarefas',
      templateUrl:'views/tarefas.html',
      controller: 'tarefaController',
      controllerAs:'ctrl'
    })
    .state('cd_usuario',{
      url: '/cadastra_usuario',
      templateUrl:'views/cadastra_usuario.html',
      controller: 'cadastraUsuarioController',
      controllerAs:'ctrl'
    })
    .state('template.alterar_usuario',{
      url: '/alterar_usuario',
      templateUrl:'views/alterar_usuario.html',
      controller: 'alterarUsuarioController',
      controllerAs:'ctrl'
    })
     .state('rp_senha',{
      url: '/recupera_senha',
      templateUrl:'views/recuperar_senha.html',
      controller: 'recuperarSenhaController',
      controllerAs:'ctrl'
    });;

  });
