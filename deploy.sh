#!/bin/bash

# this script is used to deploy site and api to vercel

npm run build -- --scope '{api,site}'

mkdir -p fullfiller/api && cd fullfiller
echo '{}' > package.json
echo '{ "rewrites": [{ "source": "/api/(.*)", "destination": "/api" }] }' > vercel.json
cp ../packages/api/dist/bundle.js api/index.js
cp -r ../packages/site/dist public

# could instead just use `vercel deploy`, but advantages are:
# - deploy without sharing the source code with Vercel
# - helpful in debugging (error messages for a failed build are displayed locally)
# - improve understanding by being able to inspect the build output
#
# must use default options, so press enter on every prompt
vercel build --prod && vercel deploy --prod --prebuilt
