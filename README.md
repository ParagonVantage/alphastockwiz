
# StockLens — static site (MVP)

This is a lightweight, two-tone (purple/white) static website scaffold with a sleek side pop-up navigation, a banner header, and pages for:
- Home
- Client Onboarding (form with KYC/Aadhaar uploads, client-side validation only)
- Reports (sample table)
- Blog
- Services
- Bio

## Dev notes
- External CSS: `assets/css/styles.css`
- JS: `assets/js/app.js`
- Certificate: `assets/docs/INH000022312_SHILPA.pdf` (linked in drawer/footer)
- For production, wire the onboarding form to a secure backend (HTTPS-only) and store files with encryption at rest and strict access controls.

## Serve locally
Use any static server, e.g.:
```bash
cd stocklens-site
python -m http.server 8080
# Visit http://localhost:8080/index.html
```
