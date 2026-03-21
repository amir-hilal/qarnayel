# Security Rules

## Deployed Firestore rules

These rules are live on the Firebase project. They apply to the `(default)` database and must also be applied to the `staging` named database once it is created.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isPublished() {
      return resource.data.status == 'published';
    }

    match /places/{id} {
      allow read: if isPublished() || isAuthenticated();
      allow write: if isAuthenticated();
    }

    match /pageContent/{id} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    match /siteSettings/{id} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### What these rules enforce

- **Public website** — unauthenticated clients only see `published` documents. Drafts and archived documents are never exposed.
- **Admin dashboard** — any authenticated Firebase Auth user has full read/write access.
- **Catch-all** — any unlisted collection is fully denied.

## Deployed Storage rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Named database (staging)

When the `staging` named database is created, apply the same Firestore rules to it via **Firebase Console → Firestore → Databases → staging → Rules**.

## TODO

- [ ] Implement custom claims role-checking (`isAdmin()` → check `request.auth.token.role`)
- [ ] Upgrade `isAuthenticated()` → `isAdmin()` once custom claims are set
- [ ] Apply identical rules to the `staging` named database
- [ ] Test all read paths with unauthenticated simulation in Rules Playground
- [ ] Test all write paths with authenticated + unauthenticated simulation

## Firestore security rules

### Design principles

1. All writes require authentication
2. All admin writes require the user to be authenticated (role checks via custom claims when fully wired)
3. The public website (unauthenticated) can only read `published` documents
4. Archived and draft documents are never exposed to unauthenticated clients
5. The `siteSettings` collection is readable by anyone but writable by admins only

### Planned rule structure (pseudocode)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      // TODO: check custom claim when role system is active
      return isAuthenticated();
    }

    function isPublished(resource) {
      return resource.data.status == 'published';
    }

    // Places
    match /places/{placeId} {
      allow read: if isPublished(resource) || isAdmin();
      allow write: if isAdmin();
    }

    // Page content
    match /pageContent/{slug} {
      allow read: if true;           // page content is always public
      allow write: if isAdmin();
    }

    // Site settings
    match /siteSettings/{settingId} {
      allow read: if true;           // global settings are public
      allow write: if isAdmin();
    }

  }
}
```

### Named database considerations

The `staging` named database should have the same rules as the default database. Apply rules to both databases in the Firebase Console or `firestore.rules`.

## Firebase Storage security rules

### Design principles

1. Authenticated admin users may upload files
2. Public read access is required so download URLs work on the public website
3. File size and type validation should be enforced in the application layer before upload

### Planned rule structure

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;                          // public read for download URLs
      allow write: if request.auth != null          // authenticated write only
                   && request.resource.size < 10 * 1024 * 1024   // max 10MB
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Implementation steps

1. Write the Firestore rules to `firestore.rules` in the project root
2. Write the Storage rules to `storage.rules` in the project root
3. Deploy rules using Firebase CLI: `firebase deploy --only firestore:rules,storage`
4. Test rules using the Firebase Console Rules Playground

## TODO

- [ ] Implement custom claims role-checking in `isAdmin()` helper
- [ ] Add per-collection write validation rules
- [ ] Add field-level validation where possible
- [ ] Test all public-access read paths with unauthenticated simulation
- [ ] Test all write paths with authenticated + unauthenticated simulation
