#!/bin/bash

BACKUP_ROOT="$HOME/.backup/$(date +%Y%m%d_%H%M%S)"

function usage() {
	echo "Usage: backup file ..."
}

function error_msg () {
	echo "backup: $1"
}

function get_abs_path() {
	if [[ $1 =~ ^/.*$ ]] ; then
		echo $1
	else
		echo $(cd $(dirname $1) && pwd)/$(basename $1)
	fi
}

if [ $# -ne 1 ]; then
	usage
	exit
fi

src="$1"

if [ $src = "-c" ]; then
	rm -rf $(dirname $BACKUP_ROOT)
	echo "Clear All Backups."
	exit
fi

if [ -d $src ]; then
	error_msg "$src: Directory can not backup."
	exit
elif [ ! -e $src ]; then
	error_msg "$src: No such file."
	exit
fi

echo $BACKUP_ROOT

dst="$BACKUP_ROOT$(get_abs_path $1)"

mkdir -p $(dirname $dst)
cp $src $dst
