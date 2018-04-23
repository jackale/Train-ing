using System.Collections;
using System.Collections.Generic;
using UnityEngine;

abstract public class Tower : MonoBehaviour {

	protected int grade;
	protected int atk;
	protected const int MAX_GRADE = 3;

	[SerializeField]
	protected EnergyManager energyManager;

	// Use this for initialization
	void Start () {
		this.grade = 1;
		this.atk = 100;
	}
	
	// Update is called once per frame
	void Update () {
		// TODO カバー範囲の監視
		// TODO クリックイベントの監視
	}

	void upgrade() {
		if (this.grade == MAX_GRADE)
			return;
		this.grade++;
		this.atk += 10; // FIXME: Magic Number
	}

	void downgrade() {
		// FIXME: Magic Number
		if (this.grade == 1)
			return;
		this.atk -= 10;
	}

	protected virtual void shoot(Enemy enemy) {}

	void onClick () {
	}

	void onEnemyEnter(Enemy enemy) {
		this.shoot (enemy);
	}
}
