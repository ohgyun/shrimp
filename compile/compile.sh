#!/bin/bash

java -jar compiler.jar \
--js ../src/core.js \
--js ../src/util.js \
--js ../src/ps.js \
--js ../src/pointcut.js \
--js ../src/advice.js \
--js ../src/aop.js \
--js_output_file j-framework.js

mv j-framework.js ../

exit 0
