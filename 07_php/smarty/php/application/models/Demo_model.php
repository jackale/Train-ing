<?php

class Demo_model extends CI_Model
{
	public function __construct()
	{
		// CI_Model constructor の呼び出し
		parent::__construct();
	}
	public function c()
	{
		return $this->db->count_all('employees');
	}
}