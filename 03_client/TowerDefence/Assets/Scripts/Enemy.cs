using System.Collections;
using System.Collections.Generic;
using UnityEngine;

abstract public class Enemy : MonoBehaviour {

	protected int hitPoint;
	protected float speed;

	[SerializeField]
	protected EnergyManager energyManager;

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}

	void damage(Tower tower) {
	}

	public void move() {
	
	}

	void onDead() {
	}


}
