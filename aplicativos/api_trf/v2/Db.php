<?php

	class Db {

		private $con;

		public function __construct(){
			$this->con = new mysqli("localhost", "root", "1234", "mydb");
		}

		public function query($sql){
			return $this->con->query($sql);
		}

	}