#!/usr/bin/env bash
set -euo pipefail
flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage"

npx lighthouse http://localhost:4321/ --output=json --output-path=verify/lighthouse-home-mobile.json --form-factor=mobile --emulated-form-factor=mobile --screenEmulation.mobile=true --chrome-path=/usr/bin/google-chrome --chrome-flags="$flags" --quiet --only-categories=performance,accessibility,best-practices,seo
npx lighthouse http://localhost:4321/ --output=json --output-path=verify/lighthouse-home-desktop.json --form-factor=desktop --emulated-form-factor=desktop --screenEmulation.mobile=false --screenEmulation.width=1280 --screenEmulation.height=900 --screenEmulation.deviceScaleFactor=1 --chrome-path=/usr/bin/google-chrome --chrome-flags="$flags" --quiet --only-categories=performance,accessibility,best-practices,seo

for page in apuntes formas traducciones; do
  npx lighthouse "http://localhost:4321/$page" --output=json --output-path="verify/lighthouse-$page-mobile.json" --form-factor=mobile --emulated-form-factor=mobile --screenEmulation.mobile=true --chrome-path=/usr/bin/google-chrome --chrome-flags="$flags" --quiet --only-categories=performance,accessibility,best-practices,seo
done
