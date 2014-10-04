#!/bin/bash
cp spine.js ./myproject/spine.js
python3 closure-library/closure/bin/build/closurebuilder.py \
  --root=closure-library/ \
  --root=myproject/ \
  --namespace="spine" \
  --output_mode=compiled \
  --compiler_jar=compiler.jar \
--compiler_flags="--language_in=ECMASCRIPT5" \
> spine-impact-compiled.js