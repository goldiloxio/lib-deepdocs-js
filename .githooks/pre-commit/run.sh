#!/bin/bash
source ./.githooks/colors.sh

echo >&2 "${green}[precommit] building markdown documentation${no_color}"
sh .githooks/pre-commit/deepdocs || exit 1;

echo >&2 "${green}[precommit] building html documentation${no_color}"
sh .githooks/pre-commit/documentation || exit 1;

echo >&2 "${green}[precommit] running linter and type-checker${no_color}"
sh .githooks/pre-commit/lint-typecheck || exit 1;

echo >&2 "${green}[precommit] checking beautified files${no_color}"
sh .githooks/pre-commit/prettier || exit 1;

echo >&2 "${green}[precommit] checking dependencies${no_color}"
sh .githooks/pre-commit/shrinkwrap || exit 1;
