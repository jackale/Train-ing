using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

enum GameStatus {
	TITLE,
	PLAY
}

public class GameManager : MonoBehaviour {

//	protected GameStatus gameStatus;

	[SerializeField]
	protected EnemyController enemyController;
	
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		// TODO 一定間隔で実行する
		this.EnemySpawn ();
	}

	void EnemySpawn() {
		//TODO 実装する
	}

	void GameOver() {
		//TODO 実装する
	}
}
