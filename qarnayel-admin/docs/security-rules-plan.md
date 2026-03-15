# Security Rules Plan

## Firestore security rules

### Design principles

1. All writes require authentication
2. All admin writes require the user to be authenticated (role checks via custom claims when fully wired)
3. The public website (unauthenticated) can only read `published` documents
4. Archived and draft documents are never exposed to unauthenticated clients
5. The `siteSettings` collection is readable by anyone but writable by admins only
6. The `media` collection is writable by authenticated admins only

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

    // History
    match /history/{entryId} {
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

    // Media metadata
    match /media/{mediaId} {
      allow read: if true;           // download URLs are public
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
