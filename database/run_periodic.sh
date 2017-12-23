#!/bin/bash

now=$(date +"%T")

echo -e "--------------$now----------------\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR
source activate djangoEnv
python periodic.py
source deactivate
cd - >/dev/null

echo -e "--------------------------------------\n"

