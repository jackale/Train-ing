<?php

class MY_Controller extends CI_Controller
{
	public $smarty = null;


	function __construct()
	{
		parent::__construct();
		$this->smarty = new Smarty();
		$this->smarty->setTemplateDir(VIEWPATH);
	}

	function assign_tpl($key, $values = null)
	{
		if ($values === null && is_array($ket))
		{
			$this->smarty->assign($vars);
		}
		else {
			$this->smarty->assign($key, $values);
		}
	}

	function render($file_path, $vars = array())
	{
		if (!empty($vars))
		{
			$this->smarty->assign($vars);
		}
		$this->smarty->display($file_path);
	}
}