#!/bin/bash

java -jar compiler.jar \
--js ../src/core.js \
--js ../src/lib/util.js \
--js ../src/lib/ps.js \
--js ../src/lib/pointcut.js \
--js ../src/lib/advice.js \
--js ../src/lib/aop.js \
--js_output_file jeff.js

mv jeff.js ../

exit 0
