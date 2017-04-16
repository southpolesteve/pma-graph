#!/bin/bash
set -x
URL=$(now -e NODE_ENV=production)
now alias set ${URL} pma.now.sh
