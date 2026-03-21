# Manual Setup Checklist

This checklist documents every task that **cannot be completed automatically** by running code. Each item must be done manually before the project is production-ready.

---

## Firebase setup

- [ ] Create a single Firebase project (e.g. `qarnayel`) in Firebase Console
- [ ] Register a web app `qarnayel-public-web` — copy config to `.env.local`
- [ ] Enable Firestore (region: `me-central1`) in production mode
- [ ] Enable Storage (region: `me-central1`) in production mode
- [ ] Apply Firestore security rules (from [firebase-setup.md](./firebase-setup.md))
- [ ] Apply Storage security rules (from [firebase-storage-guide.md](./firebase-storage-guide.md))
- [ ] Create Firestore composite indexes (from [firebase-setup.md](./firebase-setup.md))
- [ ] Configure Storage CORS if needed (from [media-management-guide.md](./media-management-guide.md))

---

## Vercel setup

- [ ] Create Vercel project and connect to the GitHub repository
- [ ] Set `main` branch → Production environment
- [ ] Set `staging` branch → Preview environment
- [ ] Add all environment variables from `.env.example` to Vercel (Production values)
- [ ] Add all environment variables from `.env.example` to Vercel (Preview/Staging values)
- [ ] Configure custom domain `qarnayel.lb` → Production Vercel deployment
- [ ] Configure domain/subdomain for staging (e.g. `staging.qarnayel.lb`)
- [ ] Set DNS records at domain registrar

---

## Domain and DNS

- [ ] Register or confirm ownership of domain `qarnayel.lb`
- [ ] Point `qarnayel.lb` A/CNAME records to Vercel
- [ ] Point `staging.qarnayel.lb` to Vercel preview deployment (optional)
- [ ] Confirm SSL certificate issued by Vercel

---

## Firebase Storage configuration

- [ ] Create folder structure in Storage: `places/`, `general/`
- [ ] Upload default OG image to `general/og-default.jpg`
- [ ] Upload logo to `general/logo.svg`

---

## Content

- [ ] Create at least one published place in Firestore for testing
- [ ] Create `pageContent` documents for `history` and `contact` slugs
- [ ] Create `siteSettings` document with ID `global`
- [ ] Verify all required fields are populated in both Arabic and English

---

## Google Maps

- [ ] Verify Google Maps URLs work for all places
- [ ] Confirm coordinates (lat/lng) are accurate for attraction-type places
- [ ] (Optional) Obtain Maps Embed API key for future embedded maps

---

## SEO and metadata

- [ ] Write and review all meta titles and descriptions for both languages
- [ ] Upload or designate OG images for all key pages
- [ ] Verify `sitemap.xml` generates correctly after first deployment
- [ ] Submit sitemap to Google Search Console for both staging and production
- [ ] Verify structured data (JSON-LD) using Google's Rich Results Test

---

## Analytics (optional)

- [ ] Enable Google Analytics in Firebase Console (if desired)
- [ ] Add GA measurement ID to environment variables
- [ ] Verify events are tracking in staging before enabling in production

---

## Accessibility

- [ ] Run Lighthouse accessibility audit on all pages
- [ ] Test keyboard navigation on all interactive elements
- [ ] Test screen reader on homepage and place detail page
- [ ] Verify RTL layout with Arabic locale
- [ ] Verify colour contrast meets WCAG AA

---

## Final pre-launch review

- [ ] No placeholder text in published content
- [ ] No test/fake data in production Firestore
- [ ] All external links tested and valid
- [ ] Error pages (404, 500) display correctly in both languages
- [ ] Site loads correctly on mobile devices
