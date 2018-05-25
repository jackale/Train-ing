<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Demo extends MY_Controller {

	public function index()
	{
		// mariaDB接続確認
		// var_dump($this->load->database());

		$this->smarty();
	}

	public function smarty()
	{
		// mariaDB接続確認
		// var_dump($this->load->database());

		$this->load->model('Demo_model', 'demo');
		$rset = $this->demo->db->get('employees', 10)->result_array();

		$this->render('demo/index.smarty', array(
			'rset' => $rset,
		));
	}

	public function twig()
	{
		$loader = new Twig_Loader_Filesystem(VIEWPATH);
		$twig = new Twig_Environment($loader);

		$this->load->model('Demo_model', 'demo');
		$rset = $this->demo->db->get('employees', 10)->result_array();

		echo $twig->render('demo/index.twig', array(
			'rset' => $rset,
		));
	}

	public function sql()
	{
		$data = array(
			"name" => "アラブの石油王",
			"age" => 22,
			"gender" => "male"
		);
		$engine = new SQLEngine();
		$this->smarty();
		// $regist = $engine->prepare("tutorial/regist");
		// if ($regist->executeUpdate($data) === 1) {
		// 	$id = $regist->lastInsertId();
		// 	$mypage = $engine->prepare("common/mypage");
		// 	$rset = $mypage->executeQuery([ "id" => $id ]);
		// 	Response::forge(View_Smarty::forge("mypage", $rset));
		// } else {
		// 	Response::redirect("error/fatal");
		// }
	}
}
