#!/usr/bin/env bash
# Builds the chat's knowledge file (src/cv.txt) from the CV PDF.
# Run it again after every CV change, then redeploy the worker.
# The output is gitignored: the repo is public, the CV text stays local.
set -euo pipefail
cd "$(dirname "$0")"

# Date of birth is dropped: fine on a CV sent to an employer, not for anyone on the internet.
pdftotext "../Marwan Mostafa.pdf" - \
  | tr -d '\f' \
  | sed -E 's/Date of Birth: [^|]*\| ?//' \
  > src/cv.txt

echo "src/cv.txt: $(wc -w < src/cv.txt) words"
