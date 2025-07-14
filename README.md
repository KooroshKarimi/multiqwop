# QWOP Multiplayer

Eine moderne Web-Implementierung des klassischen QWOP-Spiels mit globaler Highscore-Liste.

## Über das Projekt

QWOP ist ein berüchtigtes Ragdoll-Laufspiel aus dem Jahr 2008, entwickelt von Bennett Foddy. In diesem extrem schwierigen Spiel steuert der Spieler einen Läufer, indem er vier Tasten betätigt – Q, W, O, P, jeweils zuständig für bestimmte Beinmuskeln.

Diese Web-App bietet:
- **Originalgetreues Gameplay**: Die kernigen Mechaniken von QWOP bleiben erhalten
- **Touch-Steuerung**: Optimiert für Mobilgeräte mit Touch-Buttons
- **Globale Highscore-Liste**: Asynchroner Wettbewerb mit Spielern weltweit
- **Responsive Design**: Funktioniert auf Desktop und Mobilgeräten
- **Cloud-Backend**: Skalierbare Architektur mit Firebase

## Technologie-Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Physik-Engine**: Planck.js (Box2D-Port für JavaScript)
- **Backend**: Firebase Firestore für Highscores
- **Build-Tool**: Webpack
- **Hosting**: Firebase Hosting (geplant)

## Installation und Entwicklung

### Voraussetzungen

- Node.js (Version 14 oder höher)
- npm oder yarn

### Installation

1. Repository klonen:
```bash
git clone <repository-url>
cd qwop-multiplayer
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Entwicklungsserver starten:
```bash
npm start
```

Die Anwendung ist dann unter `http://localhost:3000` verfügbar.

### Build

Für Produktion:
```bash
npm run build
```

## Spielmechanik

### Steuerung

- **Q**: Linker Oberschenkel (Hüftgelenk)
- **W**: Rechter Oberschenkel (Hüftgelenk)
- **O**: Linker Unterschenkel (Kniegelenk)
- **P**: Rechter Unterschenkel (Kniegelenk)

### Spielziel

- Lauf 100 Meter ohne hinzufallen
- Überwinde die Hürde bei 50 Metern
- Erreiche das Ziel bei 100 Metern
- Erreiche die beste Distanz für die Highscore-Liste

### Touch-Steuerung

Auf Mobilgeräten werden die Steuerungstasten in den Ecken des Bildschirms angezeigt:
- **Links oben**: Q (linker Oberschenkel)
- **Links unten**: W (rechter Oberschenkel)
- **Rechts oben**: O (linker Unterschenkel)
- **Rechts unten**: P (rechter Unterschenkel)

## Projektstruktur

```
qwop-multiplayer/
├── src/
│   ├── js/
│   │   ├── main.js              # Hauptanwendung
│   │   ├── game-manager.js      # Spielkoordination
│   │   ├── physics-engine.js    # Physik-Simulation
│   │   ├── renderer.js          # Grafik-Rendering
│   │   ├── input-manager.js     # Eingabe-Verwaltung
│   │   ├── screen-manager.js    # UI-Screen-Management
│   │   └── firebase-service.js  # Backend-Kommunikation
│   ├── css/
│   │   └── main.css             # Styling
│   └── assets/                  # Bilder und Assets
├── dist/                        # Build-Ausgabe
├── index.html                   # Haupt-HTML-Datei
├── package.json                 # Projekt-Konfiguration
├── webpack.config.js           # Webpack-Konfiguration
└── README.md                   # Diese Datei
```

## Architektur

### Frontend-Komponenten

1. **GameManager**: Koordiniert alle Spielkomponenten
2. **PhysicsEngine**: Planck.js-basierte Physik-Simulation
3. **Renderer**: Canvas-basiertes Rendering
4. **InputManager**: Touch- und Maus-Eingabe
5. **ScreenManager**: UI-Screen-Übergänge
6. **FirebaseService**: Backend-Kommunikation

### Backend-Services

- **Firestore**: NoSQL-Datenbank für Highscores
- **Firebase Hosting**: Statisches Hosting (geplant)
- **Cloud Functions**: Serverless-Funktionen (geplant)

## Features

### Implementiert (Phase 1)

- ✅ Grundlegende Spielmechanik
- ✅ Touch-Steuerung für Mobilgeräte
- ✅ Responsive Design
- ✅ Physik-Simulation mit Planck.js
- ✅ Canvas-Rendering
- ✅ Screen-Management
- ✅ Mock-Firebase-Service
- ✅ Highscore-System (Mock)
- ✅ Game-Over-Logik
- ✅ Formular für Score-Eintragung

### Geplant (Phase 2)

- 🔄 Echte Firebase-Integration
- 🔄 E-Mail-Verifikation
- 🔄 Live-Highscore-Updates
- 🔄 Sound-Effekte
- 🔄 Erweiterte Animationen
- 🔄 Performance-Optimierungen

## Entwicklung

### Code-Stil

- ES6+ JavaScript
- Modulare Architektur
- Event-driven Design
- Responsive Design-Prinzipien

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Deployment

### Lokale Entwicklung

```bash
npm start
```

### Produktion

```bash
npm run build
```

Die Build-Dateien werden im `dist/`-Verzeichnis erstellt.

## Konfiguration

### Firebase-Setup

1. Firebase-Projekt erstellen
2. Firestore-Datenbank einrichten
3. Sicherheitsregeln konfigurieren
4. Firebase-Konfiguration in `firebase-service.js` eintragen

### Umgebungsvariablen

- `FIREBASE_API_KEY`: Firebase API-Schlüssel
- `FIREBASE_PROJECT_ID`: Firebase Projekt-ID
- `FIREBASE_AUTH_DOMAIN`: Firebase Auth-Domain

## Lizenz

MIT License - siehe LICENSE-Datei für Details.

## Beitragen

1. Fork des Repositories
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## Support

Bei Fragen oder Problemen:
- Issue im GitHub-Repository erstellen
- Dokumentation in der `QWOP-Multiplayer-Spezifikation.md` lesen

## Credits

- Original QWOP von Bennett Foddy (2008)
- Planck.js für Physik-Simulation
- Firebase für Backend-Services

---

**Viel Spaß beim Spielen und Entwickeln!** 🏃‍♂️💨