# Manual Setup Checklist

Use this checklist when setting up the admin dashboard for the first time.

## Firebase project

- [ ] Firebase project created (or existing project confirmed)
- [ ] Firestore enabled in production mode
- [ ] `staging` named Firestore database created
- [ ] Firebase Storage enabled
- [ ] Firebase Auth enabled with Email/Password provider
- [ ] Web app registered in Firebase Console — config values noted
- [ ] Firestore indexes created (see `docs/firebase-setup.md`)

## Security rules

- [ ] Firestore security rules written (see `docs/security-rules-plan.md`)
- [ ] Storage security rules written
- [ ] Rules deployed: `firebase deploy --only firestore:rules,storage`

## Admin users

- [ ] First admin user created in Firebase Console → Authentication → Users
- [ ] Admin user can sign in at `/login`
- [ ] (Future) Custom claim role set for admin user

## Local environment

- [ ] `.env.local` created from `.env.example`
- [ ] All required environment variables filled in
- [ ] `npm install` completed without errors
- [ ] `npm run dev` starts the app without errors
- [ ] Can sign in with admin credentials
- [ ] Can create and edit a place
- [ ] Can upload an image

## Staging deployment

- [ ] Staging deployment created on Vercel (or equivalent)
- [ ] Staging environment variables configured:
  - `NEXT_PUBLIC_APP_ENV=staging`
  - `NEXT_PUBLIC_FIRESTORE_DATABASE_ID=staging`
- [ ] Staging deployment accessible
- [ ] Login works on staging
- [ ] Content saved to `staging` Firestore database (verify in Firebase Console)

## Production deployment

- [ ] Production deployment created on Vercel
- [ ] Production environment variables configured:
  - `NEXT_PUBLIC_APP_ENV=production`
  - `NEXT_PUBLIC_FIRESTORE_DATABASE_ID=` (empty)
- [ ] Production deployment accessible
- [ ] Login works on production
- [ ] Content saved to default Firestore database (verify in Firebase Console)

## Public website integration

- [ ] Public website (`qarnayel-fe`) configured with correct `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` per environment
- [ ] Published content appears on the public website
- [ ] Draft content does NOT appear on the public website
- [ ] Preview links in admin point to the correct public website URL

## Final verification

- [ ] Create a test place as draft — does NOT appear on public site ✓
- [ ] Publish the test place — DOES appear on public site ✓
- [ ] Archive the test place — disappears from public site ✓
- [ ] Upload an image — appears in media manager ✓
- [ ] Preview button opens correct public URL ✓
