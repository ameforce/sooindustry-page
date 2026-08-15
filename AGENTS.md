# SOOIN Industry repository instructions

## Mobile acceptance

- Treat desktop viewport emulation as a development check, not physical-device acceptance.
- For every change that affects mobile layout, typography, touch gestures, navigation, media, or animation, provide a URL that can be opened on a real phone before asking for visual approval.
- Prefer an exact-branch Cloudflare Pages preview with HTTPS. If the Pages preview is unavailable or redirected to production, use a temporary HTTPS Cloudflare Quick Tunnel backed by the freshly built `sooindustry-react/out` directory.
- Provide the temporary HTTPS URL and a QR code, verify the URL and all referenced CSS, JavaScript, font, and image resources return `200`, and keep the preview alive until the user confirms or asks to stop it.
- Do not apply production `upgrade-insecure-requests` or HSTS headers to a plain-HTTP LAN preview. LAN HTTP may be used for diagnostics, but it is not sufficient for mobile acceptance.
- Validate 390 / 768 / 1024 / 1440px automatically and exercise touch-specific behavior separately. When physical devices are available, compare at least one iPhone browser and one Android browser before production approval; record any platform rendering difference that remains.
- A temporary tunnel is a review aid, not a production deployment. Do not merge, publish, change DNS, or replace the production site merely to provide mobile acceptance.
