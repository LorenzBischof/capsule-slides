#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
build_dir="${repo_root}/_site"

if ! grep -qF 'href="styles.css"' "${repo_root}/index.html"; then
  printf 'Could not find the styles.css reference in index.html\n' >&2
  exit 1
fi

if ! grep -qF 'src="deck.js"' "${repo_root}/index.html"; then
  printf 'Could not find the deck.js reference in index.html\n' >&2
  exit 1
fi

css_hash="$(sha256sum "${repo_root}/styles.css" | cut -c1-12)"
js_hash="$(sha256sum "${repo_root}/deck.js" | cut -c1-12)"
css_file="styles.${css_hash}.css"
js_file="deck.${js_hash}.js"

rm -rf -- "${build_dir}"
mkdir -p "${build_dir}"

cp "${repo_root}/index.html" "${build_dir}/index.html"
cp "${repo_root}/styles.css" "${build_dir}/${css_file}"
cp "${repo_root}/deck.js" "${build_dir}/${js_file}"
cp -R "${repo_root}/assets" "${build_dir}/assets"
cp -R "${repo_root}/vendor" "${build_dir}/vendor"

sed -i \
  -e "s|href=\"styles.css\"|href=\"${css_file}\"|" \
  -e "s|src=\"deck.js\"|src=\"${js_file}\"|" \
  "${build_dir}/index.html"

printf 'Built %s with %s and %s\n' "${build_dir}" "${css_file}" "${js_file}"
