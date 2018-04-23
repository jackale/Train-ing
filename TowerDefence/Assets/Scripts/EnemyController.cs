using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyController : MonoBehaviour {

	protected List<Enemy> enemyList;

	// Use this for initialization
	void Start () {
		this.enemyList = new List<Enemy> ();
	}
	
	// Update is called once per frame
	void Update () {
		
	}

	void spawn() {
		Enemy enemy = new Enemy1 ();
		enemyList.Add (enemy);
	}

	void moveAll () {
		foreach (Enemy enemy in this.enemyList) {
			enemy.move ();
		}
	}

	void deadCountUp() {
		
	}

}
