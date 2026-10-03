# MMN App

Access-code login → shared team hint pool → pick hints from characters.  
Stack: Vite, React, TypeScript, Ant Design, Emotion, Firebase Firestore.

## Run locally

```powershell
cd C:\Users\pawel\repos\MMN_app
npm.cmd install
npm.cmd run dev
```

## Firebase setup

1. Open [Firebase Console](https://console.firebase.google.com/) → your project.
2. Add a **Web** app if you have not already, copy the config into `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. **Build → Firestore Database → Create database** (start in test mode is fine for now).
4. **Build → Storage → Get started** (start in test mode). Then **Rules** → paste `storage.rules` → Publish.
5. **Firestore → Rules** → paste contents of `firestore.rules` → Publish.  
   (Prototype rules allow all reads/writes. Do not use this for a public launch.)
6. Restart `npm.cmd run dev`.
6. On the login page click **Load demo data**.
7. Log in with code: `TEST01`

## How the game model works

| Concept | Behaviour |
|--------|-----------|
| Access code | Shared login for a team (e.g. `TEST01`) |
| Team budget | e.g. 16 hints total for everyone on that code |
| Characters | e.g. 12 people, each with 3 hints |
| Take hint | Next unused hint on that character; uses 1 team hint |
| Caps | Character empty at 3/3; team blocked at 16/16 |

Admin can edit Firestore docs between games (`accessCodes`, `characters`, `games`).

Character names and hint texts are stored in both English and Polish:

```js
name: { en: "Ada", pl: "Ada" }
hints: [{ id: "h1", text: { en: "...", pl: "..." } }]
```

The UI language switcher (EN / PL) reads the matching field. Existing demo data can be patched from the login page with **Update EN/PL texts in database**.

## Pages

- `/` — player login
- `/play` — characters, claim hints, team unlock list
- `/admin` — admin PIN, then create/edit games

Default admin PIN is `mmn-admin`. Change it with `VITE_ADMIN_PIN` in `.env` (then restart / redeploy).

## Deploy (Firebase Hosting)

Friends get a public URL like `https://YOUR_PROJECT_ID.web.app`.

```powershell
cd C:\Users\pawel\repos\MMN_app
npm.cmd install
npx.cmd firebase login
npx.cmd firebase use --add
npm.cmd run deploy
```

- `firebase login` opens Google sign-in in the browser (use the same account as the Firebase project).
- `firebase use --add` → pick your **MMN app** project → alias e.g. `default`.
- Deploy prints the Hosting URL at the end — share that link.

Important: Vite bakes `.env` into the build. Keep `.env` filled before `npm run deploy`.

Prototype Firestore rules are open — anyone with the URL can read/write data. Fine for friend testing; tighten before a real game.
