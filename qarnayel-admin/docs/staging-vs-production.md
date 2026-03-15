# Staging vs Production

## One Firebase project

There is one Firebase project shared across all environments. All environments use the same Firebase credentials (API key, project ID, etc.).

## Environment isolation strategy

Environment isolation is achieved through:

1. **Firestore named database**: `staging` for non-production, default for production
2. **`NEXT_PUBLIC_APP_ENV`**: runtime flag for conditional behavior
3. **`NEXT_PUBLIC_FIRESTORE_DATABASE_ID`**: selects which Firestore database to target

## Firestore databases

| Environment | Database | Config |
|---|---|---|
| Production | Default Firestore database | `NEXT_PUBLIC_FIRESTORE_DATABASE_ID=` (empty) |
| Staging | Named database: `staging` | `NEXT_PUBLIC_FIRESTORE_DATABASE_ID=staging` |
| Development | Named database: `staging` or emulator | `NEXT_PUBLIC_FIRESTORE_DATABASE_ID=staging` |

### How the `staging` named database works

The `staging` named database is a separate Firestore database within the same Firebase project. It has its own data but shares the same Firebase credentials. Admin and public website apps that target `staging` read from and write to this separate database, leaving the production default database untouched.

Create the `staging` named database in the Firebase Console:
> Firebase Console → Firestore Database → Databases → Add database → Set ID: `staging`

## Firebase Storage

Firebase Storage uses a **single shared bucket** across environments. Uploaded files from both staging and production go to the same bucket. Use path conventions (e.g. `places/{id}/...`) to organise files.

If strict isolation is needed in the future, separate Storage buckets can be added to the same Firebase project.

## Firebase Auth

Firebase Auth is shared. User accounts and admin users are the same across environments. When testing auth locally, use the same Firebase Auth users.

## Public website targeting

The public website (`qarnayel-fe`) also uses the same one Firebase project. It must be configured with the correct `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` to target the same database as the admin app for that environment:

- Public website staging → `staging` database
- Public website production → default database

Both admin and public websites read from the same database in each environment. Admin writes, public reads.

## Environment behaviour differences

| Behaviour | Development | Staging | Production |
|---|---|---|---|
| Firestore target | `staging` database (or emulator) | `staging` database | Default database |
| Preview URLs | `http://localhost:3000` | Staging public URL | Production public URL |
| Error logging | Verbose | Verbose | Silent |
| Emulators | Optional | Never | Never |
