using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class sample : MonoBehaviour {

	[SerializeField]
	private Text targetText;

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		int[] arr = {1,2,3,4,5,5,6};
		string line = ConcatExample (arr);
		targetText.text = line;
	}

	string ConcatExample(int[] intArray) {
		string line = intArray[0].ToString();

		for (int i = 1; i < intArray.Length; i++) {
			line += ", " + intArray[i].ToString();
		}

		return line;
	}
}
