#!/bin/bash

# following script is used to deploy `site` (on `/`) and `api` (on `/api`) to vercel
# usually you would connect a git repository to a vercel project
# and deployment would happen automatically on push
# however, `api` wasn't working properly — it was being served as a static file
# inspecting the deployment output on the vercel dashboard (in the 'Source' tab),
# I found that the problem happened during `api` build
# solution: build `api` locally instead of on vercel (set `buildCommand` to `""` on `vercel.json`)

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
