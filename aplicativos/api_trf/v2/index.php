<?php

	require 'Slim/Slim.php';
	require 'Db.php';
	\Slim\Slim::registerAutoloader();

	$app = new \Slim\Slim();

	$db = new Db;

	//-----------------------------------------------------------------------------------
	//							uSUARIO
	//-----------------------------------------------------------------------------------

	//http://localhost/api/gerenciadorTarefas/v1/listar
	$app->get('/listar', function() use ($app,$db){
		$lista = $db->query(sprintf("SELECT * FROM usr"));
		if($lista->num_rows > 0){
			$response['error'] = false;
			$response['lista'] = $lista->fetch_all();;
			response(200,$response);
		}else{
			$response['error'] = true;
			$response['mensagem'] = 'Não existe usuário.';
			response(200,$response);
			$app->stop();
		}
	});

	$app->post('/autenticar', function() use ($app,$db) {
		
		$data = json_decode($app->request->getBody());

		$login = $data->login;
		$senha = $data->senha;

		$res = $db->query(sprintf("SELECT usr_nm, usr_id FROM usr WHERE usr_login = '%s' AND usr_sn = '%s'",$login,$senha));

		if($res->num_rows > 0){

			$response['error'] = false;
			$response['token'] = genToken();
			$response['usuario'] = $res->fetch_all();

		} else {
			
			$response['error'] = true;
			$response['mensagem'] = "Usuário ou senha inválidos";

		}

		response(200,$response);

	});

	$app->post('/cadastrar/usuario', function () use ($app,$db){
		$data = json_decode($app->request->getBody());
		$nome = $data->nome;
		$email = $data->email;
		$usuario = $data->usuario;
		$senha = $data->senha;

		if(verificaUsuarioCadastrado($usuario,$db)){
			$response['error'] = true;
			$response['mensagem'] = 'Usuário já existente, tente outro usuario';
			response(200,$response);
			$app->stop();
		}else{
			$res = $db->query(sprintf("INSERT INTO usr (usr_nm,usr_email,usr_login,usr_sn) VALUES  ('%s','%s','%s','%s')",$nome,$email,$usuario,$senha));

			if($res){
				$response['error'] = false;
				$response['mensagem'] = 'Cadastro efetuado com sucesso!';
				
			}else{
				$response['error'] = false;
				$response['mensagem'] = 'Cadastro efetuado com sucesso!';
			}	
		}


		response(200,$response);

	});

	$app->post('/alterar/usuario', function () use ($app,$db){

		$nome = $app->request->post('nome');
		$email = $app->request->post('email');
		$sobre = $app->request->post('sobreNome');
		$senha = $app->request->post('senha');
		$usuario = $app->request->post('usuario');

		$res = $db->query(sprintf("UPDATE usr SET usr_nm = '%s',usr_sbr_nm = '%s',usr_login = '%s',usr_sn = '%s' WHERE usr_id = '%s'", $nome,$sobre,$email,$senha,$usuario));

		if($res){
			$response['error'] = false;
			$response['mensagem'] = 'Alteração efetuado com sucesso!';
			
		}else{
			$response['error'] = false;
			$response['mensagem'] = 'Não foi possivel alterar usuario!';
		}

		response(200,$response);

	});

	$app->get('/excluir/usuario', function () use ($app,$db){
		
		$usuario = $app->request->get('usuario');

		$res = $db->query(sprintf("DELETE FROM usr WHERE usr_id = '%s'", $usuario));

		if($res){
			$response['error'] = false; 	
			$response['mesnsagem'] = 'Usuário excluido com sucesso.';
			response(200,$response);
		}else{
			$response['error'] = true;
			$response['mensagem'] = 'Error ao excluir usuário.';
			response(200,$response);
			$app->stop();
		}
	});

	//-----------------------------------------------------------------------------------
	//							CATEGORIA
	//-----------------------------------------------------------------------------------

	$app->get('/listar/categorias', function () use ($app,$db){

		$usuario = $app->request->get('usuario');
		
		$lista = $db->query(sprintf("SELECT * FROM ctg WHERE usr_usr_id = '%s'",$usuario));

		if($lista->num_rows > 0){
			$response['error'] = false;
			$response['categorias'] = $lista->fetch_all(PDO::FETCH_ASSOC);
			response(200,$response);
		}else{
			$response['error'] = true;
			$response['mensagem'] = 'Não existem categorias a serem apresentadas!';
			response(200,$response);
			$app->stop();
		}

	});

	$app->put('/cadastrar/categoria', function() use ($app,$db){
		
		$data = json_decode($app->request->getBody());

		$nome = $data->nome;
		$usuario = $data->usuario;

		$res = $db->query(sprintf("INSERT INTO ctg (ctg_nm,usr_usr_id) VALUE ('%s','%s')", $nome,$usuario));

		if($res){
			$response['error'] = false;
			$response['mesnsagem'] = 'Categoria cadastrada com sucesso.';
			response(200,$response);
		} else {
			$response['error'] = true;
			$response['mensagem'] = 'Erro ao cadastrar categoria.';
			response(200,$response);
			$app->stop();
		}
	});

	$app->put('/alterar/categoria', function() use ($app,$db){
		
		$data = json_decode($app->request->getBody());

		$id = $data->id;
		$nome = $data->nome;
		$usuario = $data->usuario;

		$res = $db->query(sprintf("UPDATE ctg SET ctg_nm = '%s' WHERE ctg_id = '%s' AND usr_usr_id = '%s'",$nome,$id,$usuario));

		if($res){
			$response['error'] = false;
			$response['mensagem'] = 'Categoria alterada com sucesso.';
			response(200,$response);
		} else {
			$response['error'] = true;
			$response['mensagem'] = 'Erro ao alterar categoria.';
			response(200,$response);
			$app->stop();
		}
	});

	$app->put('/excluir/categoria', function () use ($app,$db){
		
		$data = json_decode($app->request->getBody());

		$categoriaId = $data->id;
		$usuario = $data->usuario;	
		
		$res = $db->query(sprintf("DELETE FROM ctg WHERE ctg_id = '%s' AND usr_usr_id = '%s'",$categoriaId,$usuario));

		if($res){
			$response['error'] = false;
			$response['mensagem'] = 'Categoria excluida com sucesso.';
			response(200,$response);
		} else {
			$response['error'] = true;
			$response['mensagem'] = 'Erro ao excluir categoria.';
			response(200,$response);
			$app->stop();
		}
	});


	//-----------------------------------------------------------------------------------
	//							tarefas
	//-----------------------------------------------------------------------------------

	$app->get('/listar/tarefas', function () use ($app,$db){

		$categoria = $app->request->get('categoria');
		$usuario = $app->request->get('usuario');

		$lista = $db->query(sprintf("SELECT * FROM trf WHERE ctg_ctg_id = '%s' AND ctg_usr_usr_id = '%s'",$categoria,$usuario));

		if($lista->num_rows > 0) {
			
			$response['error'] = false;
			$response['tarefas'] = $lista->fetch_all(PDO::FETCH_ASSOC);
			response(200,$response);

		} else {

			$response['error'] = true;
			$response['mensagem'] = 'Não existem tarefas a serem apresentadas!';
			response(200,$response);

		}

	});

	$app->put('/cadastrar/tarefa', function() use ($app,$db){
		
		$data = json_decode($app->request->getBody());

		$nome = $data->nome;
		$descricao = $data->descricao;
		$prioridade = $data->prioridade;
		$dataInicio = $data->dtInicio;
		$dataFinal = $data->dtFinal;

		$categoria = $data->categoria;
		$usuario = $data->usuario;

		$res = $db->query(sprintf("INSERT INTO trf (trf_nome,trf_descricao,trf_prdd,trf_dt_ini,trf_dt_fim,ctg_ctg_id,ctg_usr_usr_id) VALUES ('%s','%s','%s','%s','%s','%s','%s')",$nome,$descricao,$prioridade,$dataInicio,$dataFinal,$categoria,$usuario));

		if($res){
			$response['error'] = false;
			$response['mesnsagem'] = 'Categoria cadastrada com sucesso.';
			response(200,$response);
		} else {
			$response['error'] = true;
			$response['mensagem'] = 'Erro ao cadastrar categoria.';
			response(200,$response);
			$app->stop();
		}
	});

	$app->put('/alterar/tarefa', function() use ($app,$db){
		
		$data = json_decode($app->request->getBody());

		$nome = $data->nome;
		$descricao = $data->descricao;
		$prioridade = $data->prioridade;
		$dataInicio = $data->dtInicio;
		$dataFinal = $data->dtFinal;

		$tarefaId = $data->id;
		$categoria = $data->categoria;
		$usuario = $data->usuario;
		
		$res = $db->query(sprintf("UPDATE trf SET trf_nome = '%s', trf_descricao = '%s', trf_prdd = '%s', trf_dt_ini = '%s', trf_dt_fim = '%s' WHERE trf_id = '%s' AND ctg_ctg_id = '%s' AND ctg_usr_usr_id = '%s'",$nome,$descricao,$prioridade,$dataInicio,$dataFinal,$tarefaId,$categoria,$usuario));

		if($res){
			$response['error'] = false;
			$response['mensagem'] = 'Categoria alterada com sucesso.';
			response(200,$response);
		} else {
			$response['error'] = true;
			$response['mensagem'] = 'Erro ao alterar categoria.';
			response(200,$response);	
			$app->stop();
		}
	});


	$app->put('/excluir/tarefa', function () use ($app,$db){
		
		$data = json_decode($app->request->getBody());

		$categoriaId = $data->categoria;
		$tarefaId = $data->id;
		$usuario = $data->usuario;	
		
		$res = $db->query(sprintf("DELETE FROM trf WHERE trf_id = '%s' AND ctg_ctg_id = '%s' AND ctg_usr_usr_id = '%s'",$tarefaId,$categoriaId,$usuario));

		if($res){
			$response['error'] = false;
			$response['mensagem'] = 'Categoria excluida com sucesso.';
			response(200,$response);
		} else {
			$response['error'] = true;
			$response['mensagem'] = 'Erro ao excluir categoria.';
			response(200,$response);
			$app->stop();
		}
	});

	// funçôes auxiliares
	function response($status_code, $response) {

		$app = \Slim\Slim::getInstance();
		$app->status($status_code);
		$app->contentType("application/json");
		echo json_encode($response);

	}

	$app->get('/ola', function() use ($app){
		echo "Ola ";
	});

	function genToken(){
		return md5(uniqid(rand(), true));
	}

	function autenticar($login,$senha,$db){

		$res = $db->query(sprintf("SELECT nome FROM usr WHERE usr_login = '$s' AND usr_sn = '%s'",$login,$senha));

		if($res->num_rows > 0){
			return genToken();
		}else{
			return "false";
		}
	}

	function verificaUsuarioCadastrado($login,$db){
		
		$res = $db->query(sprintf("SELECT usr_nm FROM usr WHERE usr_login = '%s' ",$login));
		
		if($res->num_rows > 0){
			return true;
		}else{
			return false;
		}
	}

	$app->run();