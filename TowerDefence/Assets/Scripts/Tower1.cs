using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Tower1 : Tower {

	// Use this for initialization
	void Start () {
		this.atk = 110;
	}

	protected override void shoot(Enemy enemy) {
		// TODO Shootを実装
		Debug.Log ("Shooted! [Please implement me...]");
	}
}
