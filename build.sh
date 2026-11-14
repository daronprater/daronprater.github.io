#!/usr/bin/env bash
# Assembles the site pages from _partials/ + _pages/.
# Edit the shared header/footer once in _partials/, the page content in _pages/,
# then run:  bash build.sh
# (Folders starting with "_" are not published by GitHub Pages.)
set -euo pipefail
cd "$(dirname "$0")"

# build <file> <nav-key> <title> <description>
build() {
  local file="$1" nav="$2" title="$3" desc="$4" path="$1"
  [ -f "_pages/$file" ] || { echo "skip $file (no _pages/$file)"; return; }
  [ "$file" = "index.html" ] && path=""
  {
    sed -e "s~{{TITLE}}~$title~g" -e "s~{{DESC}}~$desc~g" -e "s~{{PATH}}~$path~g" _partials/head.html
    sed -e "s|data-nav=\"$nav\"|data-nav=\"$nav\" aria-current=\"page\"|" _partials/header.html
    cat "_pages/$file"
    cat _partials/footer.html
  } > "$file"
  echo "built $file"
}

build index.html        home     "Kenwood Advanced Dentistry | Cincinnati Implant, Cosmetic and Family Dentist" \
  "Dr. Michael Prater offers general, cosmetic and implant dentistry in Kenwood, Cincinnati. Crowns, veneers, whitening, Botox and more. Call (513) 793-3722."
build general.html      services "General and Cosmetic Dentistry | Kenwood Advanced Dentistry" \
  "Cleanings, crowns and bridges, veneers, whitening, inlays and onlays, dentures, gum therapy, TMJ treatment, children's dentistry and Botox in Cincinnati."
build implant.html      services "Dental Implants in Cincinnati | Kenwood Advanced Dentistry" \
  "Permanent tooth replacement from extraction and bone grafting to implant placement and crown, all in our Kenwood office. Call (513) 793-3722."
build patient_info.html patients "Insurance, Financing and Patient Forms | Kenwood Advanced Dentistry" \
  "Accepted dental insurance plans, payment options, CareCredit financing and downloadable new patient forms for Kenwood Advanced Dentistry."
build office_tour.html  tour     "Office Tour | Kenwood Advanced Dentistry" \
  "Take a look inside our modern Kenwood dental office at 8040 Hosbrook Road, across from the Kenwood Tower on I-71."
build contact.html      contact  "Contact and Directions | Kenwood Advanced Dentistry" \
  "Call (513) 793-3722 or visit us at 8040 Hosbrook Road, Suite 230, Cincinnati, OH 45236. Office hours, map and directions."
