# Instrukcja Firebase

Pełna, aktualna instrukcja po polsku — łącznie ze zrzutami ekranu — jest w pliku:

**[README.pl.md](README.pl.md)**

English: **[README.md](README.md)**

Ten plik zostawiamy tylko jako skrót, żeby stary link nadal działał.

Krótko:

1. Konto Google → [Firebase Console](https://console.firebase.google.com/) → **Create a project**.
2. Zarejestruj aplikację **Web (`</>`)** i skopiuj `firebaseConfig` do pliku `.env` (wzorzec: `.env.example`).
3. **Build → Firestore Database → Create database** (tryb testowy jest OK na start).
4. **Firestore → Rules** → wklej `firestore.rules` → **Publish** (tryb testowy wygasa po 30 dniach).
5. Storage i Authentication **nie są potrzebne**.
6. `npm install` → `npm run dev` → `/admin` → **Wczytaj grę testową** → kod `TEST01`.
7. Publikacja: `npx firebase login` → `npx firebase use --add` → `npm run deploy`.

Karta płatnicza nie jest potrzebna (plan Spark).
