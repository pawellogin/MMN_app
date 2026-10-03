# Instrukcja: własny projekt Firebase dla MMN App

Aplikacja MMN App działa obecnie na projekcie Firebase **`mmn-app`**, który należy do Pawła.
Ta instrukcja opisuje, jak założyć **własny** projekt Firebase (baza danych + hosting strony),
tak aby aplikacja i wszystkie dane gier należały do firmy.

Co jest potrzebne:

- konto Google (najlepiej firmowe, np. `kontakt@murdermysterynight.pl` albo dedykowane konto Gmail),
- ok. 15 minut,
- **nie jest potrzebna karta płatnicza** — aplikacja mieści się w darmowym planie *Spark*.

Aplikacja korzysta tylko z dwóch usług Firebase:

| Usługa | Do czego |
|--------|----------|
| Firestore Database | gry, postacie, podpowiedzi, kody dostępu, obrazki postaci |
| Hosting | publiczny adres strony, np. `https://nazwa-projektu.web.app` |

Firebase Storage i Authentication **nie są potrzebne**.

---

## Część 1 — dla właściciela (pracodawcy)

### Krok 1. Utwórz projekt

1. Wejdź na [https://console.firebase.google.com/](https://console.firebase.google.com/) i zaloguj się kontem Google firmy.
2. Kliknij **Utwórz projekt** (*Create a project*).
3. Nazwa projektu, np. `mmn-game`. Zapamiętaj **identyfikator projektu** (*Project ID*) widoczny pod nazwą — od niego zależy adres strony (`https://<project-id>.web.app`).
4. Google Analytics — można **wyłączyć** (nie jest używane).
5. Kliknij **Utwórz projekt** i poczekaj, aż się utworzy.

### Krok 2. Utwórz bazę danych Firestore

1. W menu po lewej: **Kompilacja → Firestore Database** (*Build → Firestore Database*).
2. Kliknij **Utwórz bazę danych** (*Create database*).
3. Wersja: **Standard**.
4. Lokalizacja: **`eur3 (europe-west)`** albo **`europe-central2 (Warszawa)`**.
   Uwaga: lokalizacji nie da się później zmienić.
5. Tryb: **Rozpocznij w trybie testowym** (*Start in test mode*) → **Utwórz**.

### Krok 3. Dodaj aplikację webową

1. Kliknij ikonę koła zębatego obok *Przegląd projektu* → **Ustawienia projektu** (*Project settings*).
2. W sekcji **Twoje aplikacje** kliknij ikonę **`</>`** (Web).
3. Nazwa aplikacji: `MMN App`. Opcję *Firebase Hosting* można zaznaczyć, ale nie trzeba.
4. Kliknij **Zarejestruj aplikację**.
5. Pojawi się fragment kodu z obiektem `firebaseConfig`, wyglądający mniej więcej tak:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "mmn-game.firebaseapp.com",
     projectId: "mmn-game",
     storageBucket: "mmn-game.firebasestorage.app",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

   **Skopiuj go** — będzie potrzebny w Części 2. (Te klucze nie są tajne, można je wysłać mailem.)

### Krok 4. Daj dostęp programiście (zalecane)

Najprościej, jeśli dalszą konfigurację i publikację zrobi programista:

1. **Ustawienia projektu → Użytkownicy i uprawnienia** (*Users and permissions*).
2. **Dodaj członka** → wpisz adres e-mail programisty (konto Google).
3. Rola: **Właściciel** (*Owner*) lub **Edytujący** (*Editor*) → **Dodaj członka**.

Projekt nadal należy do firmy — dostęp programisty można w każdej chwili odebrać w tym samym miejscu.

Jeśli programista ma dostęp, na tym kończy się rola właściciela. Część 2 wykonuje programista.

---

## Część 2 — podłączenie aplikacji do nowego projektu (programista)

Wymagane: Node.js, kod aplikacji w `C:\Users\pawel\repos\MMN_app`.

### Krok 5. Podmień konfigurację Firebase w kodzie

Otwórz plik `src/lib/firebase.ts` i zastąp cały obiekt `firebaseConfig` tym skopiowanym w Kroku 3.

### Krok 6. Ustaw PIN do panelu admina

W pliku `.env` w głównym folderze projektu ustaw własny PIN (domyślny to `mmn-admin`):

```env
VITE_ADMIN_PIN=twoj-tajny-pin
```

### Krok 7. Połącz narzędzie Firebase CLI z nowym projektem

```powershell
cd C:\Users\pawel\repos\MMN_app
npm.cmd install
npx.cmd firebase logout
npx.cmd firebase login
npx.cmd firebase use --add
```

- `firebase login` — zaloguj się kontem Google, które ma dostęp do **nowego** projektu.
- `firebase use --add` — wybierz nowy projekt z listy, alias np. `firma`.

### Krok 8. Opublikuj reguły Firestore

```powershell
npx.cmd firebase deploy --only firestore:rules
```

(Alternatywnie: w konsoli **Firestore Database → Reguły**, wklej zawartość pliku `firestore.rules` i kliknij **Opublikuj**.)

Bez tego kroku tryb testowy wygaśnie po 30 dniach i aplikacja przestanie działać z błędem *Missing or insufficient permissions*.

### Krok 9. Zbuduj i opublikuj stronę

```powershell
npm.cmd run deploy
```

Na końcu w terminalu pojawi się adres strony, np.:

```
Hosting URL: https://mmn-game.web.app
```

To jest nowy publiczny adres aplikacji.

### Krok 10. Sprawdź działanie

1. Otwórz `https://<project-id>.web.app/admin` i zaloguj się PIN-em z Kroku 6.
2. Kliknij **Wczytaj grę testową**.
3. Wejdź na stronę główną i zaloguj się kodem **`TEST01`** — powinny pojawić się postacie.

---

## Ważne informacje

- **Dane się nie przenoszą.** Nowy projekt ma pustą bazę. Gry utworzone w starym projekcie `mmn-app` trzeba utworzyć ponownie w panelu admina.
- **Stary adres przestanie być aktualny.** Gracze muszą dostać nowy link (`https://<project-id>.web.app`). Stary projekt można po migracji usunąć albo zostawić.
- **Własna domena (opcjonalnie).** W konsoli **Hosting → Dodaj domenę niestandardową** można podpiąć np. `gra.murdermysterynight.pl` (wymaga dodania rekordów DNS u dostawcy domeny).
- **Bezpieczeństwo.** Obecne reguły Firestore są otwarte (każdy, kto zna adres, może czytać i zapisywać dane). Na testy to wystarczy; przed dużym, publicznym użyciem warto je zaostrzyć.
- **Koszty.** Darmowy plan Spark: 1 GB danych w Firestore, 50 000 odczytów i 20 000 zapisów dziennie, 10 GB transferu hostingu miesięcznie. Dla gier z kilkudziesięcioma graczami to z dużym zapasem.
