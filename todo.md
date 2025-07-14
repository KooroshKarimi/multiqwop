# TODO-Liste: QWOP Multiplayer Web-App

## Phase 1: Grundlagen & Setup (Leicht)

### Projekt-Setup
- [ ] **Projektstruktur erstellen**
  - **Akzeptanzkriterien**: Ordnerstruktur für Frontend (HTML, CSS, JS) und Backend-Konfiguration vorhanden
  - **Beschreibung**: Basis-Projektstruktur mit separaten Ordnern für Assets, Scripts, Styles

- [ ] **Google Cloud Projekt einrichten**
  - **Akzeptanzkriterien**: Firebase-Projekt erstellt, Firestore-Datenbank konfiguriert
  - **Beschreibung**: Cloud-Infrastruktur für Hosting und Datenbank vorbereiten

- [ ] **Entwicklungsumgebung konfigurieren**
  - **Akzeptanzkriterien**: Lokaler Entwicklungsserver läuft, Hot-Reload funktioniert
  - **Beschreibung**: Entwicklungstools und Build-Pipeline einrichten

### Basis-UI
- [ ] **HTML-Grundstruktur erstellen**
  - **Akzeptanzkriterien**: Responsive HTML-Seite mit Canvas-Element und UI-Container
  - **Beschreibung**: Basis-HTML mit Canvas für Spiel und UI-Bereichen

- [ ] **CSS-Grundstyling implementieren**
  - **Akzeptanzkriterien**: Responsive Design, Touch-Buttons in den Ecken positioniert
  - **Beschreibung**: Grundlegendes Styling für mobile und Desktop-Ansicht

- [ ] **Canvas-Setup und Rendering-Loop**
  - **Akzeptanzkriterien**: Canvas läuft mit 60 FPS, Hintergrund wird gezeichnet
  - **Beschreibung**: Basis-Canvas-Rendering mit Game-Loop implementieren

## Phase 2: Physik-Engine & Spielmechanik (Mittel)

### Physik-Engine Integration
- [ ] **Planck.js einbinden und konfigurieren**
  - **Akzeptanzkriterien**: Physik-Engine läuft, Welt mit Schwerkraft erstellt
  - **Beschreibung**: 2D-Physik-Engine für Ragdoll-Simulation einrichten

- [ ] **Läufer-Ragdoll modellieren**
  - **Akzeptanzkriterien**: Läufer besteht aus Körperteilen (Beine, Rumpf, Kopf) mit Gelenken
  - **Beschreibung**: Ragdoll-Figur mit realistischen Körperproportionen erstellen

- [ ] **Boden und Kollisionserkennung**
  - **Akzeptanzkriterien**: Läufer kann auf Boden stehen, Kollisionen werden erkannt
  - **Beschreibung**: Laufbahn als statischer Körper mit Reibung implementieren

### Steuerungssystem
- [ ] **Touch-Button-System implementieren**
  - **Akzeptanzkriterien**: 4 Touch-Buttons in den Ecken, visuelles Feedback bei Druck
  - **Beschreibung**: Q/W/O/P Buttons mit Touch-Event-Handling

- [ ] **Physik-Steuerung verknüpfen**
  - **Akzeptanzkriterien**: Button-Druck erzeugt Kräfte an entsprechenden Gelenken
  - **Beschreibung**: Touch-Input mit Physik-Motoren an Gelenken verbinden

- [ ] **Mehrfacheingabe ermöglichen**
  - **Akzeptanzkriterien**: Mehrere Buttons gleichzeitig gedrückt halten möglich
  - **Beschreibung**: Simultane Touch-Events für komplexe Bewegungen

### Spielmechanik
- [ ] **Distanzberechnung implementieren**
  - **Akzeptanzkriterien**: Aktuelle Position wird in Metern angezeigt (0.1m genau)
  - **Beschreibung**: Fortlaufende Berechnung der zurückgelegten Distanz

- [ ] **Spielende-Logik**
  - **Akzeptanzkriterien**: Spiel endet bei Sturz (Körper berührt Boden) oder 100m erreicht
  - **Beschreibung**: Bedingungen für Spielende und Game-Over-Screen

- [ ] **Hürde bei 50m implementieren**
  - **Akzeptanzkriterien**: Hindernis bei 50m wird angezeigt und verursacht Stürze
  - **Beschreibung**: Kollisionsobjekt für Hürden-Hindernis

## Phase 3: UI/UX & Spielgefühl (Mittel)

### Benutzeroberfläche
- [ ] **HUD und Distanzanzeige**
  - **Akzeptanzkriterien**: Distanz wird prominent angezeigt, aktualisiert sich kontinuierlich
  - **Beschreibung**: Heads-Up-Display mit Spielinformationen

- [ ] **Game-Over-Screen**
  - **Akzeptanzkriterien**: Nach Spielende wird Ergebnis mit Neustart-Option angezeigt
  - **Beschreibung**: Ergebnisanzeige mit erreichter Distanz und Aktions-Buttons

- [ ] **Responsive Design optimieren**
  - **Akzeptanzkriterien**: Spiel funktioniert auf verschiedenen Bildschirmgrößen optimal
  - **Beschreibung**: Anpassung für Mobile, Tablet und Desktop

### Spielgefühl & Feedback
- [ ] **Physik-Parameter optimieren**
  - **Akzeptanzkriterien**: Laufen ist schwierig aber machbar, Stürze sind realistisch
  - **Beschreibung**: Feintuning von Masse, Kräften, Reibung für optimales Gameplay

- [ ] **Visuelles Feedback verbessern**
  - **Akzeptanzkriterien**: Button-Feedback, Läufer-Animation, Sturz-Effekte
  - **Beschreibung**: Visuelle Verbesserungen für besseres Spielgefühl

- [ ] **Neustart-Funktionalität**
  - **Akzeptanzkriterien**: Spieler kann sofort nach Game-Over neu starten
  - **Beschreibung**: Reset-Mechanismus für wiederholtes Spielen

## Phase 4: Backend & Datenbank (Schwer)

### Firestore-Integration
- [ ] **Firebase SDK einbinden**
  - **Akzeptanzkriterien**: Verbindung zu Firestore hergestellt, Daten können gelesen/geschrieben werden
  - **Beschreibung**: Firebase-Client-Integration für Datenbankzugriff

- [ ] **Score-Datenmodell definieren**
  - **Akzeptanzkriterien**: Score-Dokumente mit Name, Email, Distanz, Timestamp
  - **Beschreibung**: Datenstruktur für Highscore-Einträge festlegen

- [ ] **Sicherheitsregeln konfigurieren**
  - **Akzeptanzkriterien**: Clients können Scores erstellen/aktualisieren, aber keine E-Mails lesen
  - **Beschreibung**: Firestore-Sicherheitsregeln für sicheres Datenmanagement

### Highscore-System
- [ ] **Score-Eintrag implementieren**
  - **Akzeptanzkriterien**: Nach Spielende kann Score mit Name/Email gespeichert werden
  - **Beschreibung**: Formular und Speicherlogik für neue Highscores

- [ ] **Highscore-Liste anzeigen**
  - **Akzeptanzkriterien**: Top 10-20 Scores werden sortiert nach Distanz angezeigt
  - **Beschreibung**: Abruf und Darstellung der globalen Bestenliste

- [ ] **E-Mail-Einzigartigkeit**
  - **Akzeptanzkriterien**: Pro E-Mail nur der beste Score gespeichert, Updates funktionieren
  - **Beschreibung**: Logik für Update bestehender Scores statt Duplikate

## Phase 5: E-Mail & Verifikation (Schwer)

### E-Mail-System
- [ ] **Cloud Functions für E-Mail-Versand**
  - **Akzeptanzkriterien**: Bei Score-Eintrag wird automatisch E-Mail versendet
  - **Beschreibung**: Serverless-Funktion für E-Mail-Benachrichtigungen

- [ ] **E-Mail-Template erstellen**
  - **Akzeptanzkriterien**: E-Mail enthält Name, Distanz und Verifikationsinformationen
  - **Beschreibung**: Professionelles E-Mail-Template für Score-Bestätigungen

- [ ] **SendGrid/SMTP-Integration**
  - **Akzeptanzkriterien**: E-Mails werden zuverlässig versendet, Spam-Filter umgangen
  - **Beschreibung**: E-Mail-Service-Integration für automatischen Versand

### Verifikationssystem
- [ ] **Verifikations-Token generieren**
  - **Akzeptanzkriterien**: Eindeutige Token für jeden Score-Eintrag erstellt
  - **Beschreibung**: Sichere Token-Generierung für E-Mail-Verifikation

- [ ] **Verifikations-Endpoint**
  - **Akzeptanzkriterien**: Klick auf E-Mail-Link markiert Score als verifiziert
  - **Beschreibung**: HTTP-Endpoint für E-Mail-Verifikation

## Phase 6: Multiplayer-Features (Schwer)

### Asynchrone Multiplayer-Elemente
- [ ] **Geister-Markierungen implementieren**
  - **Akzeptanzkriterien**: Bestmarken anderer Spieler werden auf der Strecke angezeigt
  - **Beschreibung**: Statische Markierungen für Vergleich mit anderen Spielern

- [ ] **Rang-Anzeige nach Spielende**
  - **Akzeptanzkriterien**: Spieler sieht seinen Platz in der globalen Rangliste
  - **Beschreibung**: Kontextuelle Anzeige der eigenen Leistung im Vergleich

- [ ] **Echtzeit-Updates (Optional)**
  - **Akzeptanzkriterien**: Highscore-Liste aktualisiert sich automatisch bei neuen Scores
  - **Beschreibung**: Live-Updates der Bestenliste via WebSocket oder Firestore-Listener

### Cheat-Schutz
- [ ] **Client-seitige Validierung**
  - **Akzeptanzkriterien**: Unrealistische Scores werden abgelehnt (z.B. >100m)
  - **Beschreibung**: Grundlegende Validierung der Score-Daten

- [ ] **Code-Obfuskierung**
  - **Akzeptanzkriterien**: JavaScript-Code ist schwer lesbar für Manipulation
  - **Beschreibung**: Minifizierung und Obfuskierung des Client-Codes

## Phase 7: Performance & Optimierung (Schwer)

### Performance-Optimierung
- [ ] **Frame-Rate optimieren**
  - **Akzeptanzkriterien**: Konstante 60 FPS auf modernen Geräten, mindestens 30 FPS
  - **Beschreibung**: Optimierung der Render-Loops und Physik-Berechnungen

- [ ] **Memory-Management**
  - **Akzeptanzkriterien**: Keine Memory-Leaks, stabiler Speicherverbrauch
  - **Beschreibung**: Optimierung der Garbage Collection und Objekt-Verwaltung

- [ ] **Asset-Optimierung**
  - **Akzeptanzkriterien**: Schnelle Ladezeiten, komprimierte Assets
  - **Beschreibung**: Minifizierung und Komprimierung von CSS, JS, Bildern

### Skalierbarkeit
- [ ] **Cloud-Deployment konfigurieren**
  - **Akzeptanzkriterien**: App läuft auf Google Cloud, automatische Skalierung
  - **Beschreibung**: Production-Deployment mit CI/CD-Pipeline

- [ ] **CDN-Integration**
  - **Akzeptanzkriterien**: Globale Verfügbarkeit mit niedrigen Latenzen
  - **Beschreibung**: Content Delivery Network für statische Assets

## Phase 8: Testing & Qualitätssicherung (Mittel)

### Testing
- [ ] **Unit-Tests für Kern-Logik**
  - **Akzeptanzkriterien**: Kritische Funktionen haben automatisierte Tests
  - **Beschreibung**: Tests für Physik-Berechnungen und Score-Validierung

- [ ] **Integration-Tests**
  - **Akzeptanzkriterien**: End-to-End-Tests für Score-Eintrag und E-Mail-Versand
  - **Beschreibung**: Automatisierte Tests für Backend-Integration

- [ ] **Cross-Browser-Testing**
  - **Akzeptanzkriterien**: App funktioniert auf Chrome, Safari, Firefox, Edge
  - **Beschreibung**: Browser-Kompatibilitätstests

### Benutzer-Tests
- [ ] **Touch-Steuerung testen**
  - **Akzeptanzkriterien**: Steuerung funktioniert intuitiv auf verschiedenen Mobilgeräten
  - **Beschreibung**: Usability-Tests für Touch-Interface

- [ ] **Performance-Tests**
  - **Akzeptanzkriterien**: App läuft flüssig auf älteren Geräten
  - **Beschreibung**: Performance-Tests auf verschiedenen Hardware-Konfigurationen

## Phase 9: Finalisierung & Launch (Leicht)

### Dokumentation
- [ ] **README erstellen**
  - **Akzeptanzkriterien**: Vollständige Dokumentation für Entwickler und Benutzer
  - **Beschreibung**: Projekt-Dokumentation mit Setup-Anweisungen

- [ ] **API-Dokumentation**
  - **Akzeptanzkriterien**: Backend-API ist dokumentiert für zukünftige Erweiterungen
  - **Beschreibung**: Dokumentation der Datenbank-Struktur und Endpoints

### Launch-Vorbereitung
- [ ] **Domain und SSL konfigurieren**
  - **Akzeptanzkriterien**: HTTPS-Verbindung, professionelle Domain
  - **Beschreibung**: Production-Umgebung mit SSL-Zertifikat

- [ ] **Monitoring einrichten**
  - **Akzeptanzkriterien**: Performance-Monitoring und Error-Tracking aktiv
  - **Beschreibung**: Überwachung der App-Performance und Fehler

- [ ] **QR-Code für einfachen Zugang**
  - **Akzeptanzkriterien**: QR-Code führt direkt zur App, funktioniert auf Events
  - **Beschreibung**: QR-Code-Generierung für einfache Verbreitung

---

**Gesamtfortschritt**: [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] (0/9 Phasen abgeschlossen)

**Nächste Schritte**: Beginnen Sie mit Phase 1 (Grundlagen & Setup) und arbeiten Sie sich systematisch durch die Phasen. Jede Phase baut auf der vorherigen auf und sollte vollständig abgeschlossen werden, bevor die nächste Phase beginnt.