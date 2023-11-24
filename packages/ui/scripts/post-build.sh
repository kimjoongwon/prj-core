# ./scripts/post-build.sh

#!/bin/bash

sed -i '1,1s/^/"use client"; /' ./dist/index.js
sed -i '1,1s/^/"use client"; /' ./dist/index.mjs