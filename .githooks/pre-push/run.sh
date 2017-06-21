#!/bin/bash
source ./.githooks/colors.sh

echo >&2 "${green}[prepush] running linter, type-checker, and test suite${no_color}"
sh .githooks/pre-push/lint-typecheck-jest || exit 1;
