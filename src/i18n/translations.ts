import type { Lang } from './localized'

type Dict = {
  language: string
  appName: string
  logoLinkTitle: string
  loginLead: string
  accessCode: string
  accessCodeRequired: string
  accessCodePlaceholder: string
  logIn: string
  loggedIn: string
  loginFailed: string
  firebaseMissing: string
  firebaseMissingHint: string
  seedHint: string
  loadDemo: string
  demoReady: string
  updateLanguages: string
  languagesUpdated: string
  codeLabel: string
  hintsLeft: string
  logOut: string
  characters: string
  takeHint: string
  takeHintConfirmTitle: (name: string) => string
  takeHintConfirmBody: (left: number) => string
  hintsAvailable: (count: number) => string
  noHintsOnCharacter: string
  noCharacters: string
  unlockedHints: string
  noUnlocked: string
  hint: string
  gotIt: string
  allHintsUsed: string
  dataErrorHint: string
  claimFailed: string
  rouletteSetting: string
  rouletteSettingHelp: string
  rouletteIntroTitle: string
  rouletteIntroLead: string
  rouletteIntroSteps: string[]
  rouletteTitle: string
  rouletteQuickHelp: string
  rouletteRed: string
  rouletteBlack: string
  rouletteCancel: string
  rouletteSpinning: (color: string) => string
  rouletteWin: string
  rouletteLose: string
  rouletteLoseBody: (left: number) => string
  admin: string
  adminTitle: string
  adminLead: string
  adminPin: string
  adminPinRequired: string
  adminEnter: string
  gamesTitle: string
  newGame: string
  editGame: string
  noGames: string
  saveGame: string
  gameSaved: string
  joinCode: string
  copyCode: string
  copied: string
  joinCodeOnSave: string
  hintLimit: string
  hintLimitHelp: string
  addCharacter: string
  removeCharacter: string
  addHint: string
  removeHint: string
  characterName: string
  characterImage: string
  uploadImage: string
  removeImage: string
  positionImage: string
  positionImageTitle: string
  positionImageHint: string
  positionImageZoom: string
  positionImageFit: string
  positionImageSave: string
  hintQuestion: string
  hintOrder: string
  hintOrderSequential: string
  hintOrderRandom: string
  hintOrderAll: string
  hintOrderAllHelp: string
  gameCodes: string
  gameCodesHelp: string
  addCode: string
  codeAdded: (code: string) => string
  noCodes: string
  takenHints: (count: number) => string
  resetCode: string
  resetCodeConfirm: (code: string) => string
  resetDone: string
  deleteCode: string
  deleteCodeConfirm: (code: string) => string
  codeDeleted: string
  backToGames: string
  adminLogout: string
  english: string
  polish: string
  usedHints: string
  deleteGame: string
  deleteGameConfirm: string
  gameName: string
  openAdmin: string
  backToLogin: string
  retry: string
  firestoreListDeniedTitle: string
  firestoreListDeniedBody: string
  heroEyebrow: string
  playEyebrow: string
  adminEyebrow: string
  navPlay: string
  navStories: string
  menu: string
  writeToUs: string
  footerContact: string
  footerMenu: string
  footerAbout: string
  footerRights: string
  errors: Record<string, string>
}

export const translations: Record<Lang, Dict> = {
  en: {
    language: 'Language',
    appName: 'Murder Mystery Night',
    logoLinkTitle: 'Murder Mystery Night website (opens in a new tab)',
    loginLead:
      'Enter the access code you received to unlock hints for your team.',
    accessCode: 'Access code',
    accessCodeRequired: 'Enter your access code',
    accessCodePlaceholder: 'e.g. TEST01',
    logIn: 'Log in',
    loggedIn: 'Logged in',
    loginFailed: 'Login failed',
    firebaseMissing: 'Firebase keys missing',
    firebaseMissingHint: 'Add your web app config to .env and restart the app.',
    seedHint:
      'First time? After Firestore is ready, load demo data (or update EN/PL texts if data already exists):',
    loadDemo: 'Load test game',
    demoReady: 'Test game ready. Join code: TEST01',
    updateLanguages: 'Update EN/PL texts in database',
    languagesUpdated: 'English and Polish texts updated in Firestore.',
    codeLabel: 'Code',
    hintsLeft: 'Chances left',
    logOut: 'Log out',
    characters: 'Characters',
    takeHint: 'Take hint',
    takeHintConfirmTitle: (name) => `Take a hint from ${name}?`,
    takeHintConfirmBody: (left) =>
      `This uses 1 of your team's remaining chances (${left} left).`,
    hintsAvailable: (count) =>
      `${count} hint${count === 1 ? '' : 's'} still available`,
    noHintsOnCharacter: 'No hints left on this character',
    noCharacters: 'No characters yet. Seed demo data from the login page.',
    unlockedHints: "Your team's unlocked hints",
    noUnlocked: 'No hints taken yet.',
    hint: 'Hint',
    gotIt: 'Got it',
    allHintsUsed: 'Your team has used all its chances.',
    dataErrorHint: 'Check Firestore rules and that demo data was loaded.',
    claimFailed: 'Could not take hint',
    rouletteSetting: 'Hint roulette',
    rouletteSettingHelp:
      'For every chance, players bet on red or black. A win reveals the hint; a loss uses up the team\'s chance without revealing anything.',
    rouletteIntroTitle: 'How to play?',
    rouletteIntroLead: 'In this game every hint is decided by the roulette.',
    rouletteIntroSteps: [
      'Click "Take hint" on a character and bet on red or black.',
      'Win: you get the hint. It uses 1 of your team\'s chances.',
      'Lose: you get nothing and still use 1 chance.',
    ],
    rouletteTitle: 'Roulette',
    rouletteQuickHelp:
      'Pick a colour. Guess right and you get the hint. Either way, 1 team chance is used.',
    rouletteRed: 'Red',
    rouletteBlack: 'Black',
    rouletteCancel: 'Cancel',
    rouletteSpinning: (color) => `Spinning… you bet on ${color.toLowerCase()}`,
    rouletteWin: 'You won!',
    rouletteLose: 'You lost',
    rouletteLoseBody: (left) =>
      `No hint this time. Chances left: ${left}.`,
    admin: 'Admin',
    adminTitle: 'Admin panel',
    adminLead: 'Enter the admin PIN to create games, characters, and join codes.',
    adminPin: 'Admin PIN',
    adminPinRequired: 'Enter the admin PIN',
    adminEnter: 'Enter admin',
    gamesTitle: 'Games',
    newGame: 'New game',
    editGame: 'Edit game',
    noGames: 'No games yet. Create one to generate a join code.',
    saveGame: 'Save game',
    gameSaved: 'Game saved.',
    joinCode: 'Join code',
    copyCode: 'Copy code',
    copied: 'Copied',
    joinCodeOnSave: 'The first join code is generated when you save the game.',
    hintLimit: 'Team chance limit',
    hintLimitHelp:
      'How many chances to get a hint the whole team has in this game (all characters combined).',
    addCharacter: 'Add character',
    removeCharacter: 'Remove character',
    addHint: 'Add hint',
    removeHint: 'Remove hint',
    characterName: 'Character name',
    characterImage: 'Character image',
    uploadImage: 'Upload image',
    removeImage: 'Remove image',
    positionImage: 'Reposition image',
    positionImageTitle: 'Position image',
    positionImageHint:
      'Drag the image to move it and zoom with the slider or mouse wheel. Everything inside the frame will be shown.',
    positionImageZoom: 'Zoom',
    positionImageFit: 'Fit',
    positionImageSave: 'Use image',
    hintQuestion: 'Hint / question',
    hintOrder: 'Hint order',
    hintOrderSequential: 'In written order',
    hintOrderRandom: 'Random',
    hintOrderAll: 'Hint order for all questions',
    hintOrderAllHelp:
      'Sets the hint order for every question at once. You can still change individual questions below.',
    gameCodes: 'Join codes',
    gameCodesHelp:
      'Each code is a separate playthrough of this game with its own chance counter. Create one code per team or event.',
    addCode: 'Add code',
    codeAdded: (code) => `New join code: ${code}`,
    noCodes: 'No codes yet. Add one so players can join.',
    takenHints: (count) => `Taken hints (${count})`,
    resetCode: 'Reset',
    resetCodeConfirm: (code) =>
      `Reset code ${code}? Unlocked hints and used chances will be cleared and this team will start from zero. Other codes are not affected.`,
    resetDone: 'Chance counter reset.',
    deleteCode: 'Delete',
    deleteCodeConfirm: (code) =>
      `Delete code ${code}? Players using it will lose access and their hints.`,
    codeDeleted: 'Code deleted.',
    backToGames: 'All games',
    adminLogout: 'Leave admin',
    english: 'English',
    polish: 'Polish',
    usedHints: 'Chances used',
    deleteGame: 'Delete game',
    deleteGameConfirm:
      'Delete this game, its characters, and all its join codes? This cannot be undone.',
    gameName: 'Game name',
    openAdmin: 'Admin panel',
    backToLogin: 'Player login',
    retry: 'Try again',
    firestoreListDeniedTitle: 'Firestore blocked the games list',
    firestoreListDeniedBody:
      'Open Firebase Console → Build → Firestore Database → Rules (not Storage). Replace the rules with the prototype rules from the project file firestore.rules, then click Publish and wait a few seconds.',
    heroEyebrow: 'Do you dare?',
    playEyebrow: 'Investigation in progress',
    adminEyebrow: 'Behind the scenes',
    navPlay: 'Investigation',
    navStories: 'Our stories',
    menu: 'Menu',
    writeToUs: 'Write to us!',
    footerContact: 'Contact',
    footerMenu: 'Menu',
    footerAbout:
      'Crime mysteries in envelopes to solve alone or with friends. Find the murderer.',
    footerRights: 'Murder Mystery Night. All rights reserved.',
    errors: {
      enterCode: 'Enter an access code.',
      invalidCode: 'Invalid access code.',
      codeDisabled: 'This access code is disabled.',
      codeNotLinked: 'Access code is not linked to a game.',
      codeMissing: 'Access code not found.',
      codeGone: 'Access code no longer exists.',
      characterMissing: 'Character not found.',
      noTeamHints: 'Your team has no chances left.',
      wrongGame: 'Character does not belong to this game.',
      characterEmpty: 'All hints for this character are already taken.',
      noUnusedHint: 'No unused hint left for this character.',
      seedExists:
        'Database already has access codes. Use “Update EN/PL texts” instead, or clear Firestore first.',
      wrongPin: 'Wrong admin PIN.',
      gameMissing: 'Game not found.',
      nameRequired: 'Enter a game name in English or Polish.',
      hintLimitRequired: 'Set a team chance limit of at least 1.',
      characterRequired: 'Add at least one character.',
      characterNameRequired: 'Each character needs a name.',
      hintRequired: 'Each character needs at least one hint.',
      codeTaken: 'That join code is already used.',
      codeGenFailed: 'Could not generate a unique join code. Try again.',
      imageType: 'Please choose an image file.',
      imageTooLarge:
        'Image is too large even after compression. Try a smaller photo.',
      imageTimeout:
        'Upload timed out. In Firebase Console open Build → Storage → Get started, then Rules → publish the open prototype rules and try again.',
      storageUnauthorized:
        'Storage rules blocked the upload. Open Build → Storage → Rules (not Firestore), paste the open rules, and Publish.',
      firestoreListDenied:
        'Firestore rules are blocking the games list. Publish open rules under Firestore → Rules (not Storage).',
    },
  },
  pl: {
    language: 'Język',
    appName: 'Murder Mystery Night',
    logoLinkTitle: 'Strona Murder Mystery Night (otwiera się w nowej karcie)',
    loginLead:
      'Wpisz kod dostępu, który otrzymałeś, aby odblokować wskazówki dla drużyny.',
    accessCode: 'Kod dostępu',
    accessCodeRequired: 'Wpisz kod dostępu',
    accessCodePlaceholder: 'np. TEST01',
    logIn: 'Zaloguj się',
    loggedIn: 'Zalogowano',
    loginFailed: 'Logowanie nie powiodło się',
    firebaseMissing: 'Brak kluczy Firebase',
    firebaseMissingHint:
      'Dodaj konfigurację aplikacji web do pliku .env i uruchom aplikację ponownie.',
    seedHint:
      'Pierwszy raz? Gdy Firestore jest gotowy, wczytaj dane demo (albo zaktualizuj teksty EN/PL, jeśli dane już są):',
    loadDemo: 'Wczytaj grę testową',
    demoReady: 'Gra testowa gotowa. Kod: TEST01',
    updateLanguages: 'Zaktualizuj teksty EN/PL w bazie',
    languagesUpdated: 'Teksty angielskie i polskie zaktualizowane w Firestore.',
    codeLabel: 'Kod',
    hintsLeft: 'Pozostałe szanse',
    logOut: 'Wyloguj',
    characters: 'Postacie',
    takeHint: 'Weź wskazówkę',
    takeHintConfirmTitle: (name) => `Wziąć wskazówkę od ${name}?`,
    takeHintConfirmBody: (left) =>
      `Zużywa 1 z pozostałych szans drużyny (zostało ${left}).`,
    hintsAvailable: (count) => {
      if (count === 1) return '1 wskazówka nadal dostępna'
      if (count >= 2 && count <= 4) return `${count} wskazówki nadal dostępne`
      return `${count} wskazówek nadal dostępnych`
    },
    noHintsOnCharacter: 'Brak wskazówek u tej postaci',
    noCharacters: 'Brak postaci. Wczytaj dane demo na stronie logowania.',
    unlockedHints: 'Odblokowane wskazówki drużyny',
    noUnlocked: 'Nie wzięto jeszcze żadnej wskazówki.',
    hint: 'Wskazówka',
    gotIt: 'OK',
    allHintsUsed: 'Drużyna wykorzystała wszystkie szanse.',
    dataErrorHint: 'Sprawdź reguły Firestore i czy wczytano dane demo.',
    claimFailed: 'Nie udało się wziąć wskazówki',
    rouletteSetting: 'Ruletka wskazówek',
    rouletteSettingHelp:
      'Przy każdej szansie gracze obstawiają czerwone lub czarne. Wygrana odsłania wskazówkę, przegrana zużywa szansę drużyny bez odsłaniania niczego.',
    rouletteIntroTitle: 'Jak grać?',
    rouletteIntroLead: 'W tej grze o każdej wskazówce decyduje ruletka.',
    rouletteIntroSteps: [
      'Kliknij „Weź wskazówkę” przy postaci i obstaw czerwone lub czarne.',
      'Wygrana: dostajesz wskazówkę. Zużywa 1 szansę drużyny.',
      'Przegrana: nie dostajesz nic, a 1 szansa i tak przepada.',
    ],
    rouletteTitle: 'Ruletka',
    rouletteQuickHelp:
      'Wybierz kolor. Trafisz – dostajesz wskazówkę. W obu przypadkach zużywasz 1 szansę drużyny.',
    rouletteRed: 'Czerwone',
    rouletteBlack: 'Czarne',
    rouletteCancel: 'Anuluj',
    rouletteSpinning: (color) => `Kręcimy… obstawiono: ${color.toLowerCase()}`,
    rouletteWin: 'Wygrana!',
    rouletteLose: 'Przegrana',
    rouletteLoseBody: (left) =>
      `Tym razem bez wskazówki. Pozostałe szanse: ${left}.`,
    admin: 'Admin',
    adminTitle: 'Panel administratora',
    adminLead:
      'Wpisz PIN administratora, aby tworzyć gry, postacie i kody dołączenia.',
    adminPin: 'PIN administratora',
    adminPinRequired: 'Wpisz PIN administratora',
    adminEnter: 'Wejdź do panelu',
    gamesTitle: 'Gry',
    newGame: 'Nowa gra',
    editGame: 'Edytuj grę',
    noGames: 'Brak gier. Utwórz jedną, aby wygenerować kod.',
    saveGame: 'Zapisz grę',
    gameSaved: 'Gra zapisana.',
    joinCode: 'Kod dołączenia',
    copyCode: 'Kopiuj kod',
    copied: 'Skopiowano',
    joinCodeOnSave: 'Pierwszy kod zostanie wygenerowany przy zapisie gry.',
    hintLimit: 'Limit szans drużyny',
    hintLimitHelp:
      'Ile szans na wskazówkę ma cała drużyna w tej grze (łącznie dla wszystkich postaci).',
    addCharacter: 'Dodaj postać',
    removeCharacter: 'Usuń postać',
    addHint: 'Dodaj wskazówkę',
    removeHint: 'Usuń wskazówkę',
    characterName: 'Nazwa postaci',
    characterImage: 'Zdjęcie postaci',
    uploadImage: 'Dodaj zdjęcie',
    removeImage: 'Usuń zdjęcie',
    positionImage: 'Zmień kadr',
    positionImageTitle: 'Ustaw kadr zdjęcia',
    positionImageHint:
      'Przeciągnij zdjęcie, aby je przesunąć, i przybliż suwakiem lub kółkiem myszy. Widoczne będzie wszystko w ramce.',
    positionImageZoom: 'Powiększenie',
    positionImageFit: 'Dopasuj',
    positionImageSave: 'Użyj zdjęcia',
    hintQuestion: 'Wskazówka / pytanie',
    hintOrder: 'Kolejność wskazówek',
    hintOrderSequential: 'W kolejności wpisania',
    hintOrderRandom: 'Losowo',
    hintOrderAll: 'Kolejność wskazówek dla wszystkich pytań',
    hintOrderAllHelp:
      'Ustawia kolejność wskazówek dla wszystkich pytań naraz. Poszczególne pytania nadal można zmienić poniżej.',
    gameCodes: 'Kody dołączenia',
    gameCodesHelp:
      'Każdy kod to osobna rozgrywka tej gry z własnym licznikiem szans. Utwórz jeden kod na drużynę lub wydarzenie.',
    addCode: 'Dodaj kod',
    codeAdded: (code) => `Nowy kod dołączenia: ${code}`,
    noCodes: 'Brak kodów. Dodaj kod, aby gracze mogli dołączyć.',
    takenHints: (count) => `Wzięte wskazówki (${count})`,
    resetCode: 'Resetuj',
    resetCodeConfirm: (code) =>
      `Zresetować kod ${code}? Odblokowane wskazówki i wykorzystane szanse zostaną wyczyszczone, a drużyna zacznie od zera. Inne kody pozostaną bez zmian.`,
    resetDone: 'Licznik szans zresetowany.',
    deleteCode: 'Usuń',
    deleteCodeConfirm: (code) =>
      `Usunąć kod ${code}? Gracze, którzy go używają, stracą dostęp i swoje wskazówki.`,
    codeDeleted: 'Kod usunięty.',
    backToGames: 'Wszystkie gry',
    adminLogout: 'Wyjdź z panelu',
    english: 'Angielski',
    polish: 'Polski',
    usedHints: 'Wykorzystane szanse',
    deleteGame: 'Usuń grę',
    deleteGameConfirm:
      'Usunąć tę grę, postacie i wszystkie kody dołączenia? Tej operacji nie można cofnąć.',
    gameName: 'Nazwa gry',
    openAdmin: 'Panel administratora',
    backToLogin: 'Logowanie gracza',
    retry: 'Spróbuj ponownie',
    firestoreListDeniedTitle: 'Firestore zablokował listę gier',
    firestoreListDeniedBody:
      'Otwórz Firebase Console → Build → Firestore Database → Rules (nie Storage). Wklej reguły prototypowe z pliku firestore.rules, kliknij Publish i poczekaj kilka sekund.',
    heroEyebrow: 'Czy masz dość odwagi?',
    playEyebrow: 'Śledztwo w toku',
    adminEyebrow: 'Za kulisami',
    navPlay: 'Śledztwo',
    navStories: 'Nasze historie',
    menu: 'Menu',
    writeToUs: 'Napisz do nas!',
    footerContact: 'Kontakt',
    footerMenu: 'Menu',
    footerAbout:
      'Zagadki kryminalne w kopertach do rozwiązania samemu lub ze znajomymi. Zdemaskuj mordercę.',
    footerRights: 'Murder Mystery Night. Wszelkie prawa zastrzeżone.',
    errors: {
      enterCode: 'Wpisz kod dostępu.',
      invalidCode: 'Nieprawidłowy kod dostępu.',
      codeDisabled: 'Ten kod dostępu jest wyłączony.',
      codeNotLinked: 'Kod dostępu nie jest przypisany do gry.',
      codeMissing: 'Nie znaleziono kodu dostępu.',
      codeGone: 'Kod dostępu już nie istnieje.',
      characterMissing: 'Nie znaleziono postaci.',
      noTeamHints: 'Drużyna nie ma już szans.',
      wrongGame: 'Ta postać nie należy do tej gry.',
      characterEmpty: 'Wszystkie wskazówki tej postaci są już wzięte.',
      noUnusedHint: 'Brak niewykorzystanej wskazówki u tej postaci.',
      seedExists:
        'Baza już ma kody dostępu. Użyj „Zaktualizuj teksty EN/PL” albo najpierw wyczyść Firestore.',
      wrongPin: 'Nieprawidłowy PIN administratora.',
      gameMissing: 'Nie znaleziono gry.',
      nameRequired: 'Wpisz nazwę gry po angielsku lub polsku.',
      hintLimitRequired: 'Ustaw limit szans (minimum 1).',
      characterRequired: 'Dodaj przynajmniej jedną postać.',
      characterNameRequired: 'Każda postać musi mieć nazwę.',
      hintRequired: 'Każda postać musi mieć przynajmniej jedną wskazówkę.',
      codeTaken: 'Ten kod dołączenia jest już zajęty.',
      codeGenFailed: 'Nie udało się wygenerować unikalnego kodu. Spróbuj ponownie.',
      imageType: 'Wybierz plik graficzny.',
      imageTooLarge:
        'Zdjęcie jest za duże nawet po kompresji. Wybierz mniejszą fotografię.',
      imageTimeout:
        'Wgrywanie przekroczyło czas. W Firebase Console otwórz Build → Storage → Get started, potem Rules → opublikuj otwarte reguły prototypowe i spróbuj ponownie.',
      storageUnauthorized:
        'Reguły Storage zablokowały wgrywanie. Otwórz Build → Storage → Rules (nie Firestore), wklej otwarte reguły i kliknij Publish.',
      firestoreListDenied:
        'Reguły Firestore blokują listę gier. Opublikuj otwarte reguły w Firestore → Rules (nie Storage).',
    },
  },
}

export function translateError(lang: Lang, message: string): string {
  if (message.toLowerCase().includes('insufficient permissions')) {
    return translations[lang].errors.firestoreListDenied
  }
  if (message.toLowerCase().includes('unauthorized')) {
    return translations[lang].errors.storageUnauthorized
  }
  return translations[lang].errors[message] ?? message
}
