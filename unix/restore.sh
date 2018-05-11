#!/bin/bash

BACKUP_ROOT="$HOME/.backup"
PS3="Please type the number or <enter> to exit >"

function usage() {
	echo "Usage: restore files [date_from [date_to]]"
}

function error_msg () {
	echo "restore: $1"
}

function get_abs_path() {
	if [[ $1 =~ ^/.*$ ]] ; then
		echo $1
	else
		echo $(cd $(dirname $1) && pwd)/$(basename $1)
	fi
}

if [ $# -eq 0 ]; then
	usage
	exit
fi

dst="$1"

src=$(find $BACKUP_ROOT -type f -name *$dst* | head -1)

echo "cp $src $dst"

echo $src
echo -n "num >"
read num
echo $num

# select dstp in `find $BACKUP_ROOT -type f -name *$dst*`
# #doからdoneまでループ処理
# do
#     echo $dstp
# 	break
# done

exit

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


dst="$BACKUP_ROOT$(get_abs_path $1)"

mkdir -p $(dirname $dst)
cp $src $dst
