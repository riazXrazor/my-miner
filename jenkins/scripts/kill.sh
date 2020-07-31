#!/usr/bin/env sh

echo 'The following command terminates the "npm start" process using its PID'
echo '(written to ".pidfile"), all of which were conducted when "deliver.sh"'
echo 'was executed.'
set -x
$proc_name = $(cat .pidfile)

if pgrep $proc_name
then
echo " $proc_name running "
kill $proc_name
echo "$proc_name  got killed"
else
echo " $proc_name is not running/stopped "
fi
