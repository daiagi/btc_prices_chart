#!/bin/bash

now=$(date +"%T")

echo -e "--------------$now----------------\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR
pipenv shell
python periodic.py  >> ~/Documents/btc_prices_chart/btc_prices_chart/logs/periodic.log 2>&1

#source deactivate
#cd - >/dev/null

echo -e "--------------------------------------\n"

