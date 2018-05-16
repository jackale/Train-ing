#!/bin/bash

shinsotsu=(`cat user.txt`) # user.txtは10名の名前

count=(0 0 0 0 0 0 0 0 0 0)

function is_num() {
	expr "$1" + 1 >/dev/null 2>&1
	echo $?
}

function random() {
	num=$(( $RANDOM % 10))
	echo ${shinsotsu[$num]}
	count[$num]=$(( count[$num] + 1 ))
}

function display() {
	if [ $1 -eq 1 ]; then
		random
	else
		for i in `seq 1 $1`; do
			random
		done

		for i in `seq 0 9`; do
			echo "$i, ${count[$i]}"
		done
	fi
}

if [ $# -eq 0 ]; then
	trial=1
else
	trial=$1
fi

if [ $(is_num $trial) -ge 2 ]; then
	echo "Argument must be numeric."
	exit
fi

if [ $trial -le 0 ]; then
	echo "Argument must be > 0"
	exit
fi

display $trial
