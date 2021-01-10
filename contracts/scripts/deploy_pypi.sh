#!/bin/bash

pip install --upgrade --user travis pip
pip install --upgrade --user travis twine six==1.10.0 wheel==0.31.0 setuptools
pip list
shopt -s nullglob
abifiles=( ./artifacts/*.json )
[ "${#abifiles[@]}" -lt "1" ] && echo "ABI Files for development environment not found" && exit 1
python setup.py sdist bdist_wheel
twine upload dist/*