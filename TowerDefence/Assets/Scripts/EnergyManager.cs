using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnergyManager : MonoBehaviour {

	public float energy;

	protected const float MAX_VALUE = 9999f;
	protected const float INITIAL_VALUE = 0f;

	void Start()
	{
		this.energy = INITIAL_VALUE;	
	}

	public void Increment (float amount) {
		this.energy = Mathf.Min(this.energy + amount, MAX_VALUE);
	}
	public void Decrement (float amount) {
		this.energy = Mathf.Min(this.energy - amount, 0);
	}

}
