# Kenwood Advanced Dentistry

Website for [kenwoodadvanceddentistry.com](https://www.kenwoodadvanceddentistry.com), hosted on GitHub Pages.

Plain HTML/CSS/JS with no frameworks and no build tools beyond one small shell script.

## Editing

- **Shared header and footer:** `_partials/header.html`, `_partials/footer.html`, `_partials/head.html`
- **Page content:** `_pages/*.html`
- **Styles:** `assets/css/styles.css` (colors and fonts are variables at the top)
- **Office hours:** update them in the footer partial, `_pages/index.html`, `_pages/contact.html`,
  the `HOURS` array in `assets/js/main.js` (drives the "Open now" badge), and the JSON-LD in `_partials/head.html`

After editing anything in `_partials/` or `_pages/`, rebuild the pages:

```bash
bash build.sh
```

That regenerates `index.html`, `general.html`, `implant.html`, `patient_info.html`, `office_tour.html` and `contact.html`.
Folders starting with `_` are not published by GitHub Pages.
