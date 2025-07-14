# Software-Spezifikation: Multiplayer-QWOP Web-App

## Einleitung

QWOP ist ein berüchtigtes Ragdoll-Laufspiel aus dem Jahr 2008, entwickelt von Bennett Foddy. In diesem extrem schwierigen Spiel steuert der Spieler einen Läufer, indem er vier Tasten betätigt – Q, W, O, P, jeweils zuständig für bestimmte Beinmuskeln. Das Spiel erlangte Kultstatus durch seinen absurden Schwierigkeitsgrad und wurde zu einem Internet-Meme.

Diese Spezifikation beschreibt eine moderne Web-App-Neuimplementierung von QWOP mit Multiplayer-Komponente in Form einer globalen Highscore-Liste. Das Ziel ist, das klassische Gameplay möglichst originalgetreu umzusetzen, es für Mobilgeräte (Touch-Steuerung) anzupassen und um einen asynchronen Mehrspieler-Wettbewerb zu erweitern. Die Anwendung soll auf Google Cloud betrieben werden und so schlank sein, dass Nutzer sie über einen einfachen Link oder QR-Code ohne Installation aufrufen können.

## Ziele und Rahmenbedingungen

### Originalgetreues Gameplay
Die kernigen Mechaniken von QWOP – das Laufen eines 100-Meter-Sprints, gesteuert durch vier unabhängige Beinmuskel-Steuerungen – sollen erhalten bleiben. Der Läufer soll wie im Original bei 50 Metern auf eine Hürde treffen und bei 100 Metern das Ziel erreichen (inklusive der humorvollen Weitsprung-Sequenz am Ende). Das Spiel endet, wenn der Läufer stürzt oder die 100 m erreicht.

### Multiplayer in Highscore-Form
Anstatt eines synchronen Mehrspielermodus wird ein asynchroner Wettbewerb geboten. Jeder spielt für sich, aber eine globale Bestenliste vergleicht die erzielten Distanzen. Das motiviert Spieler, gegeneinander um den weitesten Lauf anzutreten, ohne gleichzeitig online sein zu müssen. Am Ende jedes Laufs kann der Spieler seine erreichte Distanz in die Highscore-Liste eintragen und diese wird weltweit für alle sichtbar aktualisiert.

### Plattform und Zugänglichkeit
Die Anwendung soll als Web-App funktionieren, die auf Mobilgeräten optimiert ist. Ein Nutzer soll einfach einen Link anklicken oder einen QR-Code scannen und sofort spielen können – keine Installation nötig. Die Steuerung und das UI-Layout werden auf Touch-Eingabe ausgelegt (Smartphones, Tablets), aber das Spiel soll auch in Desktop-Browsern funktionieren (dann mit Mausklicks statt Tastatur). Wichtig: Eine Tastatursteuerung wird bewusst deaktiviert, um allen Spielern dieselbe Touch-basierte Herausforderung zu bieten, unabhängig vom Gerät.

### Minimaler Client-Aufwand
Es werden nur Webstandards (HTML5, JavaScript, CSS) vorausgesetzt – keine Plugins oder besonderen Hardwareanforderungen. Die App soll selbst auf leistungsschwachen mobilen Browsern flüssig laufen. Optimierungen wie geringe Ladedauer und effiziente Grafikdarstellung sind entscheidend, damit das Spiel snappig lädt und auch auf schwächeren Geräten flüssig läuft.

### Betrieb auf Google Cloud
Backend-Dienste und Datenhaltung erfolgen in der Cloud, um globale Verfügbarkeit und Skalierbarkeit zu gewährleisten. Insbesondere soll eine cloud-basierte Datenbank für die Highscore-Liste genutzt werden (z.B. Firestore). Die Server-Architektur soll mit möglichst wenig administrativem Aufwand skalieren können – ideal für unvorhergesehen viele Spieler, wie es bei viralen Spielen passieren kann.

## Funktionale Anforderungen

### 1. Spielmechanik (Gameplay)

#### Lauf-Physik
Das Spiel simuliert einen zweibeinigen Läufer, dessen Beine vom Spieler kontrolliert werden. Jeder Lauf startet bei 0 Metern auf einer 100-Meter-Bahn. Der Läufer beginnt im Stand; die Schwerkraft wirkt auf ihn, und er kann durch falsche Bewegungen umfallen. Ziel ist es, sich nach rechts vorwärts zu bewegen, ohne hinzufallen, idealerweise bis ins Ziel bei 100 m.

#### Steuerung der Beine
Wie im Original QWOP kontrolliert der Spieler vier Muskelgruppen des Läufers getrennt:

- **Q**: Oberschenkel (Hüftgelenk) des linken Beins nach vorne/hinten bewegen
- **W**: Oberschenkel des rechten Beins steuern
- **O**: Unterschenkel (Kniegelenk) des linken Beins anwinkeln/strecken
- **P**: Unterschenkel des rechten Beins steuern

Jeder dieser „Tasten" wird in der Web-App durch einen Touch-Button dargestellt. Durch Berühren der jeweiligen Schaltfläche wird Kraft auf das entsprechende Gelenk ausgeübt. Der Läufer bewegt seine Beine entsprechend – z.B. bewirkt das Drücken von Q, dass der linke Oberschenkel nach vorn oder hinten schwingt (je nach aktueller Stellung). Mehrfacheingaben (z.B. zwei Buttons gleichzeitig gedrückt halten) sollen möglich sein, da im Original komplexe Gleichlauf-Bewegungen nötig sind.

#### Touch-Steuerung auf Mobilgeräten
Das Interface platziert vier virtuelle Buttons an den Ecken des Bildschirms – entsprechend Q, W, O, P. Dadurch kann der Spieler mit beiden Daumen oder Fingern gleichzeitig verschiedene Ecken drücken:

- **Links oben**: „Q"-Taste (linker Oberschenkel)
- **Links unten**: „W"-Taste (rechter Oberschenkel)
- **Rechts oben**: „O"-Taste (linker Unterschenkel)
- **Rechts unten**: „P"-Taste (rechter Unterschenkel)

Jeder Button ist groß und halbtransparent über dem Spiel eingeblendet, sodass das Spielfeld sichtbar bleibt. Eine visuelle Rückmeldung (z.B. Aufleuchten oder Einfärben) zeigt an, wenn ein Button gedrückt wird. Auf Desktop-Geräten kann diese Steuerung via Mausklick auf die jeweiligen Bildschirmbereiche erfolgen. Keyboard-Eingaben werden ignoriert, um Chancengleichheit zu wahren und die Benutzer zur Touch/Maus-Steuerung zu führen.

#### Anzeige & HUD
Auf dem Bildschirm wird prominent die aktuelle Distanz angezeigt, die der Läufer erreicht hat (in Metern, auf eine Dezimalstelle). Diese Distanz kann auch negativ sein, falls der Läufer sich rückwärts bewegt – die Startlinie liegt bei 0 m. Zusätzlich gibt es ggf. eine Bestwert-Anzeige für den aktuellen Spieler (persönlicher Rekord) und Hinweise auf besondere Streckenmarken:

- **Bei 50 m**: Anzeige eines Hürdenhindernisses auf der Bahn. Der Spieler muss versuchen, diese Hürde zu überspringen (was in QWOP nur durch geschickte Beinmanöver möglich ist). Die Hürde wird grafisch dargestellt; berührt der Läufer sie, stolpert er höchstwahrscheinlich.
- **Bei 100 m**: Markierung der Ziellinie. Erreicht der Spieler 100 m, hat er das Spiel gewonnen. (Optional kann – wie im Original – ein Sprung-Event inszeniert werden, bei dem die Distanz des finalen Sprungs angezeigt wird. Für die Highscore-Wertung zählt jedoch primär das Erreichen der 100 m.)

#### Spielende & Neustart
Das Spiel endet, wenn der Läufer stürzt (d.h. ein Körperteil außer den Füßen den Boden berührt) oder erfolgreich die 100-m-Linie überquert. In beiden Fällen wird der Lauf beendet und der Endstand (zurückgelegte Meter) fixiert. Anschließend soll ein Game-Over-Bildschirm erscheinen mit:

- Der erreichten Distanz (und evtl. Hinweis „Ziel erreicht" bei 100 m)
- Eingabemöglichkeit für Name/E-Mail (falls noch nicht eingegeben, siehe Highscore)
- Buttons: „Nochmal laufen" (Neustart) und „Highscore anzeigen" bzw. „Score eintragen"

Der Spieler kann jederzeit nach Spielende einen weiteren Lauf starten. Es gibt keine Leben-Beschränkung – unendlich viele Versuche sind möglich.

### 2. Benutzerprofil & Highscore-Eintrag

#### Nameingabe
Um an der globalen Bestenliste teilzunehmen, gibt der Spieler einen Namen/Pseudonym ein. Dies kann bereits vor dem Spiel oder nach einem Lauf erfolgen. (Usability: Man könnte beim ersten Besuch einen kurzen Prompt „Name eingeben" zeigen, optional überspringbar für bloßes Ausprobieren. Spätestens beim Speichern eines Scores ist der Name erforderlich.) Es wird kein Passwort oder vollwertiger Account benötigt – nur ein Name, unter dem der Score angezeigt wird.

#### E-Mail (Identitätsnachweis)
Zusätzlich zum Namen wird eine E-Mail-Adresse abgefragt, um die Authentizität des Eintrags sicherzustellen. Diese E-Mail wird nicht öffentlich sichtbar auf der Highscore-Liste erscheinen, dient aber dazu, dass sich der Spieler als tatsächlicher Inhaber des Highscores ausweisen kann. Die E-Mail-Eingabe ist verpflichtend für das Speichern eines Scores, damit kein anderer unter falschem Namen einen Score einträgt. Es genügt, lediglich Name und E-Mail einzugeben – eine komplette Registrierung mit Passwort entfällt, um die Hürden gering zu halten (keine AGB-Bestätigung etc. nötig).

#### E-Mail-Verifikation
Nach Eintragung eines neuen Highscores erhält der Spieler eine Benachrichtigungs-Mail. Diese Mail enthält z.B. die erzielte Distanz, den eingetragenen Namen und ein Verifikations-Token oder Link. Damit kann der Benutzer, falls nötig, später beweisen, dass er zu dieser E-Mail-Adresse gehört und den Score erzielt hat. (Das System könnte optional verlangen, dass der Benutzer auf den Verifikationslink klickt, bevor der Score in der öffentlichen Liste erscheint. Allerdings erhöht dies die Komplexität und Wartezeit, daher wird hier angenommen, dass die Scores direkt eingetragen werden und die Mail primär dem Nachweis dient.) Die Umsetzung könnte via Cloud-Funktion oder Server erfolgen, die beim Score-Eintrag automatisch eine E-Mail versendet.

#### Datenschutz
Die Anwendung speichert die E-Mail-Adressen nur zum Zwecke der Verifikation. Öffentlich sichtbar ist lediglich der Spielername und die erzielte Distanz. Intern wird die E-Mail sicher abgelegt. (Bei Nutzung von Firestore kann z.B. ein separates Feld/Collection genutzt werden, das nicht von Clients gelesen werden kann, um die E-Mail zu speichern.) Es wird darauf geachtet, keine unnötigen persönlichen Daten zu sammeln.

### 3. Highscore-System (Globale Bestenliste)

#### Globale Bestenliste anzeigen
Die Anwendung führt eine globale Highscore-Liste, in der die besten Laufdistanzen aller Spieler aufgeführt sind. Diese Liste ist für alle Nutzer einsehbar (z.B. über einen „Highscore" Button im Hauptmenü oder automatisch nach jedem Lauf sichtbar). Angezeigt werden typischerweise die Top 10 oder Top 20 Scores mit Rank, Name des Spielers und Distanz (Meter). Optional kann auch das Datum des Scores angezeigt werden. Die Liste wird in absteigender Reihenfolge der Distanz sortiert (der weiteste Lauf oben).

#### Score eintragen
Nach einem Spielende hat der Nutzer die Möglichkeit, seine Distanz in die Highscore-Liste einzutragen.

- Falls der Spieler bereits Name/E-Mail angegeben hat (im aktuellen Spiel oder einem früheren Lauf) und noch kein besserer Score unter dieser E-Mail existiert, wird der neue Score zusammen mit Name und E-Mail an den Server gesendet.
- **Ein Eintrag pro E-Mail**: Pro E-Mail-Adresse soll nach Möglichkeit nur der beste Score gespeichert werden, um Mehrfacheinträge desselben Spielers zu vermeiden. Wenn ein Spieler also mehrmals spielt und sich verbessert, wird der beste Wert aktualisiert. Dies erfordert, dass beim Score-Eintrag geprüft wird, ob bereits ein Datensatz mit derselben E-Mail existiert. Ist der neue Score höher, wird dieser Datensatz aktualisiert (Distanz und ggf. Name, falls der Spieler seinen Namen geändert hat). Ist der Score niedriger, bleibt der bestehende Eintrag unverändert (d.h. der Spieler verbessert seinen eigenen Rekord nicht durch schwächere Versuche).
- Falls ein Spieler noch keinen Eintrag hat, wird ein neuer Datensatz erstellt.

#### Asynchrone Konkurrenzdarstellung
Obwohl nicht alle Spieler gleichzeitig laufen, soll dennoch ein gewisser Multiplayer-Feel entstehen. Dazu gibt es folgende Ansätze:

- **Während des Spiels** können Markierungen auf der Laufbahn angezeigt werden, die die Leistungen anderer Spieler repräsentieren. Z.B. eine kleine Fahne oder Linie bei 25 m mit dem Namen des aktuellen Weltrekordhalters dort, wo er gestürzt ist oder ins Ziel kam. Ebenso könnte die Bestmarke (Weltrekord) hervorgehoben werden – der Spieler sieht also, wie weit er noch vom Rekord entfernt ist. Diese „Geistermarken" werden beim Start eines Laufs anhand der Highscore-Daten gesetzt (etwa die Distanz des #1, eventuell auch #2-#3, um mehrere Vergleichspunkte zu haben). Sie bewegen sich nicht, sondern sind statisch auf der Strecke platziert, quasi als Zielmarken.
- **Nach dem eigenen Lauf** sieht der Spieler seinen Rang: z.B. „Platz 5 von 1200 Spielern weltweit" oder „Platz 1! Neuer Weltrekord!" sofern zutreffend. Diese Information wird aus der aktualisierten Bestenliste entnommen.

#### Highscore-Aktualisierung in Echtzeit
Sobald ein Spieler seinen Score übermittelt, wird die globale Bestenliste sofort im Backend aktualisiert. Andere Nutzer, die gerade die Highscore-Liste betrachten (z.B. auf dem Game-Over-Screen), könnten einen Live-Refresh erhalten. Dies ließe sich z.B. mit einem kurzen Intervall-Refresh oder via WebSocket/Realtime-Datenbank umsetzen. Da es sich aber um einfache tabellarische Daten handelt, reicht ein periodisches Neuladen alle paar Sekunden oder beim Öffnen der Liste aus. (Optional: Integration mit Firestore's Realtime-Updates oder einem WebSocket, um neue Bestleistungen unmittelbar anzuzeigen – aber das ist nicht zwingend notwendig für die Grundfunktion.)

#### Validierung und Cheat-Schutz
Da die gesamte Simulation clientseitig abläuft, besteht theoretisch die Gefahr, dass ein technisch versierter Nutzer die Software manipuliert (z.B. den Abstandszähler fälscht). Einfache Sicherheitsmaßnahmen:

- Die Distanz wird vom Spiel-Client berechnet, aber der Server könnte Grundvalidierungen durchführen (z.B. maximale erreichbare Distanz = 100 m regulär, plus ggf. ein kleiner Wert für Sprung – alles deutlich darüber wird verworfen; negative große Werte ebenso).
- Der Client-Code kann obfuskiert werden, um direkte Manipulation zu erschweren.
- Für einen höheren Schutz könnte die Physikserver-seitig parallel simuliert werden, was aber aufwendig ist und viel Rechenlast verursacht. Daher wird im MVP darauf verzichtet.
- Bei Auffälligkeiten (z.B. viele 100 m-Einträge in kurzer Zeit) könnten manuelle Prüfungen oder temporäre Sperren erfolgen. In der Spezifikation wird jedoch angenommen, dass Cheating gering bleibt und vor allem die E-Mail-Verifikation abschreckend genug wirkt, da ein Cheat-Score ohne gültige E-Mail nicht persistiert würde.

### 4. Benutzeroberfläche & Benutzererlebnis

#### Start-/Hauptmenü
Die Web-App kann mit einem simplen Startbildschirm beginnen. Hier könnte das Spiellogo (QWOP) und zwei Schaltflächen angezeigt werden: „Starten" und „Highscores". Alternativ startet das Spiel direkt in den Lauf-Modus und blendet ein Overlay zur Namenseingabe ein. Da Einfachheit betont wird, kann auch folgender Ansatz gewählt werden: Sofort spielen beim Aufruf – der Spieler sieht direkt die Laufbahn und kann loslegen. Ein kleines Infopanel erläutert die Steuerung (z.B. „Tippe auf die Ecken: Q/W steuern Oberschenkel, O/P steuern Waden"). Ein optionales Tutorial (Text oder Ghost-Anzeige) könnte neuen Spielern helfen, ist aber nicht zwingend.

#### In-Game-Interface
Während des Laufs sind folgende UI-Elemente sichtbar:

- Die Distanzanzeige oben mittig oder oben links, die kontinuierlich die aktuelle Meter zeigt (auf 0.1 m genau)
- Die virtuellen Buttons (Q, W, O, P) in den Ecken, wie oben beschrieben, mit visuellem Feedback bei Druck
- Evtl. eine Pause/Reset-Schaltfläche (z.B. in einer Ecke), um den Lauf abzubrechen oder neu zu starten, falls der Spieler festhängt. (QWOP hat normalerweise keinen Pausenmodus, aber da es eine Web-App ist, kann der Nutzer ohnehin den Tab wechseln – Pause ist also optional. Ein Reset-Button kann hilfreich sein, um nicht bis zum Sturz warten zu müssen, wenn man merkt, dass ein Lauf ruiniert ist.)

#### Grafikdesign
Das Spiel soll grafisch minimalistisch gehalten werden (ähnlich dem Original Flash-Game). Ein weißer Hintergrund für den Himmel, ein grauer oder brauner Streifen als Laufbahn, eventuell mit Linienmarkierungen alle 10 m für Orientierung. Der Läufer selbst kann als vereinfachte Ragdoll-Figur dargestellt werden – z.B. bestehend aus einfachen geometrischen Formen (Kreise für Gelenke, Linien oder Polygonsegmente für Beine, Oberkörper, Kopf). Realistische Grafik ist nicht nötig; die Bewegung der Figur steht im Vordergrund. Wichtig ist, dass die Kollisionserkennung gut funktioniert (der Läufer sollte auf dem Boden „aufstehen" können, die Füße interagieren mit dem Boden, die Hürde bei 50 m ist ein festes Hindernis etc.).

#### Audio
Falls Ressourcen vorhanden, können einfache Soundeffekte eingebaut werden (z.B. ein „Tap"-Geräusch beim Aufprall auf den Boden, Publikumsgelächter bei Stürzen, Jubel beim Erreichen des Ziels). Hintergrundmusik ist nicht zwingend, da QWOP im Original keine Musik hatte – das trägt zur konzentrierten, frustrierend-komischen Atmosphäre bei. Wenn Audio, dann sollte es dezent und es muss auf Mobilgeräten mit einer Mute-Option versehen sein.

#### Feedback und Spielgefühl
Die Anwendung soll das absurde, aber motivierende Gefühl des Originals einfangen. Jeder Fehltritt führt zu slapstickartigen Stürzen – das Ragdoll-Physikmodell soll dies ermöglichen. Die Steuerung reagiert direkt auf Touch-Eingaben; Lags müssen minimiert werden. Durch kurze Ladezeiten und einen schnellen Restart-Vorgang wird sicher gestellt, dass der Spieler es „nur noch einmal versuchen" kann, ohne Frustration durch Wartezeiten.

## Nicht-funktionale Anforderungen

### Plattformkompatibilität
Die Web-App muss auf gängigen aktuellen Mobile-Browsern laufen (Chrome, Safari, Firefox, Samsung Internet etc. auf Android/iOS). Ebenso soll sie in Desktop-Browsern (Chrome, Firefox, Safari, Edge) funktionieren. Getestet werden sollte ab etwa Chrome/Firefox ESR der letzten 2-3 Jahre und iOS Safari der letzten Generation, um ein breites Publikum abzudecken. Es wird vorausgesetzt, dass der Browser ES6+ JavaScript und HTML5 Canvas unterstützt (heutige Mobilgeräte erfüllen das). Da keine Installation nötig ist, muss die App auch ohne spezielle Rechte auskommen – sie sollte kein Kamera/Mikrofon/GPS etc. benötigen, nur eine Internetverbindung für das Laden und die Highscore-Updates.

### Performance
Trotz aufwändiger Physiksimulation soll das Spiel flüssig laufen. 60 FPS sind angestrebt für die Darstellung, mindestens jedoch ~30 FPS ohne größere Einbrüche, damit die Steuerung präzise bleibt. Die Verwendung eines performanten Physik-Frameworks (z.B. Box2D in JavaScript) und Canvas-Rendering ermöglicht eine effiziente Simulation. Inhalte werden nur gezeichnet, wenn nötig (Canvas nur bei Bewegungen updaten, statischer Hintergrund cachen). Speicherverbrauch muss optimiert sein, damit auch Geräte mit wenig RAM (ältere Smartphones) nicht einfrieren. Insbesondere muss darauf geachtet werden, dass die Physik-Berechnungen und das Zeichnen im Canvas effizient sind und die Garbage Collection nicht durch schlecht optimierte Schleifen strapaziert wird.

### Netzwerk und Latenz
Das eigentliche Gameplay läuft komplett lokal im Browser, sodass keine Latenz während des Spiels entsteht – eine Internetverbindung ist nur erforderlich beim Start (Laden der Seite) und beim Senden/Abrufen der Highscore-Daten. Diese Vorgänge sind relativ klein (ein Eintrag posten oder eine Liste abrufen) und sollten selbst über Mobilfunk schnell gehen. Die App sollte auch mit einer hohen Latenz klarkommen, da sie notfalls den Score später senden könnte. Z.B. könnte im Falle eines momentanen Verbindungsverlusts der Score zwischengespeichert und übertragen werden, sobald die Verbindung wieder steht (optional).

### Skalierbarkeit & Cloud
Die Nutzung von Google Cloud Diensten erlaubt es, auch bei vielen Spielern die Performance zu halten. Firestore als NoSQL-Datenbank skaliert automatisch für viele Lese-/Schreibzugriffe. Falls das Spiel viral geht und Tausende Nutzer gleichzeitig spielen, sollte der Datenbankdienst dies ohne bemerkbaren Leistungsverlust handhaben (die Last pro Nutzer ist minimal, nur gelegentliche kleine Datenbanktransaktionen). Der Server bzw. die Hosting-Plattform sollte ebenfalls horizontal skalierbar sein (z.B. Google App Engine oder Cloud Run ermöglicht automatische Skalierung der Instanzen bei hohem Traffic).

### Sicherheit
Neben dem oben erwähnten Cheat-Schutz bezüglich der Scores sind allgemeine Sicherheitsaspekte zu beachten:

- Die Kommunikation zwischen Client und Server/DB erfolgt über HTTPS, um Daten abhörsicher zu übertragen.
- Injections in Name/E-Mail Felder werden gefiltert oder escaped, um XSS oder SQL-Injection (falls SQL eingesetzt würde) zu verhindern. Bei Firestore sind Dokumentenfelder standardmäßig Strings und werden nicht als HTML interpretiert, dennoch sollte der Name beim Anzeigen entsprechend gefahrlos gerendert werden (z.B. in Textnodes, nicht als HTML).
- Die Highscore-Datenbank soll so konfiguriert sein, dass Clients nur erlaubte Operationen durchführen können. Beispiel bei Firestore: Sicherheitsregeln könnten erlauben, neue Score-Datensätze anzulegen oder den eigenen zu aktualisieren, aber nicht fremde Einträge zu überschreiben oder E-Mails auszulesen. So bleibt die Integrität der Daten gewahrt.
- Da keine Passwörter verwaltet werden, entfällt deren Sicherung. E-Mail-Adressen werden vertraulich behandelt (siehe Datenschutz oben).

### Wartbarkeit & Erweiterbarkeit
Der Code soll modular gestaltet werden (Trennung von Spiel-Logik, Rendering, UI und Networking). So kann das Spiel in Zukunft leichter angepasst werden – z.B. um neue Features wie andere Spielmodi oder echte Live-Multiplayer-Rennen zu integrieren. Dokumentation und sauberes API-Design sind wünschenswert, damit Entwickler (oder KI-gestützte Coder im Sinne des Vibe-Coding) effizient darauf aufbauen können. Da das Projekt offen in der Cloud läuft, sollten auch Deployment-Skripte und Konfigurationsdateien gepflegt werden, um reproduzierbare Deployments zu ermöglichen.

### Benutzerfreundlichkeit
Trotz des frustrierend spaßigen Spielprinzips soll die App bedienungsfreundlich sein:

- Kurze Ladezeiten beim Start (Assets klein halten, ggf. minify/compress JS und Bilder).
- Intuitive Bedienung ohne lange Erklärung (die Schwierigkeit liegt im Spiel selbst, nicht in der Bedienung der App).
- Responsive Design: Auf verschiedenen Bildschirmgrößen soll die Darstellung optimiert sein. Insbesondere die Position und Größe der Touch-Buttons sollte sich dem Gerät anpassen (größere Buttons für kleine Screens, eventuell anpassbare Position für Tablets). Das Spielfeld kann auf Hochformat-Smartphones etwas herausgezoomt werden, damit genug Strecke sichtbar ist, während es auf Desktop in einem breiteren Fenster dargestellt wird.
- Fehlertoleranz: Das Spiel sollte robust gegen Fehlbedienungen sein. Beispiel: Wenn der Spieler während des Spiels das Gerät dreht (Orientation Change), pausiert das Spiel oder setzt aus, um keine unfairen Fehler zu verursachen. Oder wenn versehentlich eine Browsernavigation ausgelöst wird, könnte eine Warnung „Spiel verlassen?" erscheinen, um unbeabsichtigtes Abbrechen zu verhindern.

## Technische Umsetzung und Architektur

### Architekturübersicht
Die Anwendung gliedert sich in zwei Hauptteile: Client (Front-End) und Server/Cloud (Back-End). Nach Möglichkeit wird viel Logik auf dem Client ausgeführt (für das unmittelbare Gameplay), während der Server die persistenten Daten und ggf. verifizierungsrelevante Logik übernimmt. Die grobe Architektur:

**Client**: Läuft im Browser des Spielers. Realisiert die Spielmechanik (Physik, Grafik, Eingabe) und die Darstellung der UI. Der Client kommuniziert mit dem Back-End, um Highscore-Daten zu senden oder zu empfangen. Im Optimalfall ist der Client eine Single-Page-App, die bei Spielstart geladen wird und danach ohne erneutes Laden auskommt.

**Server/Back-End**: Läuft in der Google-Cloud-Umgebung. Zuständig für Datenpersistenz (Highscores speichern/lesen) und ggf. das Versenden von Verifikations-E-Mails. Kann entweder als klassische Serveranwendung (z.B. Node.js auf Google App Engine) umgesetzt sein oder serverlos (Cloud Functions und Firestore). Hauptaufgaben:

- Bereitstellen der statischen Inhalte (HTML, CSS, JS, Bilder) der Web-App.
- Anbieten einer API (HTTP or WebSocket) für Highscore-Operationen, sofern nötig – bei Firestore kann der Client auch direkt kommunizieren.
- Speicherung der Score-Daten in der Datenbank.
- E-Mail-Versand via externen Service oder SMTP (z.B. SendGrid oder Mail API) beim Score-Eintrag.

Nach heutigem Stand bietet es sich an, den Client als reine statische Webseite zu hosten (z.B. via Firebase Hosting oder Cloud Storage + CDN), und Firestore direkt aus dem Client anzusprechen für Einfachheit. Falls komplexere Logik (z.B. E-Mail) ins Spiel kommt, kann eine Cloud Function darauf reagieren.

### Technologie-Stack (Empfehlungen)

#### Front-End
Verwendung von HTML5, CSS3 und JavaScript/TypeScript. Da es sich um ein relativ spezialisiertes Spiel handelt, kann man auf schwere UI-Frameworks verzichten. Allerdings kann der Einsatz eines Frameworks wie React mit create-react-app bzw. Next.js hilfreich sein, um die Struktur zu organisieren. Für die Kern-Spielmechanik ist das aber nicht zwingend. Alternativ könnte auch ein Game-Framework wie Phaser verwendet werden, das den Umgang mit Physik und Sprites vereinfacht; doch da QWOP sehr physiklastig und weniger sprite-animiert ist, ist ein direktes Physik-Engine-Setup wahrscheinlich effizienter.

#### Physik-Engine
Um die Lauf- und Sturzbewegungen realistisch (und witzig) zu simulieren, wird eine bewährte 2D-Physik-Engine eingesetzt. Empfohlen wird Planck.js, ein JavaScript-Port der bekannten Box2D-Engine. Planck.js bietet stabile Physik-Simulationen und lässt sich im Browser performant einsetzen. Damit kann der Läufer als Ragdoll modelliert werden, bestehend aus starren Körperteilen (Segmente für Oberschenkel, Unterschenkel, Rumpf, etc.) und Gelenken mit bestimmten Freiheitsgraden.

Jedes Gelenk (Hüfte, Knie) wird in Planck mit Limits versehen, damit sich das Bein nur in realistischen Winkeln bewegen kann (z.B. Knie kann nicht überstrecken nach hinten).

Die Massen der Körperteile, die Schwerkraft und Dämpfung werden so eingestellt, dass die Bewegung kontrollierbar, aber herausfordernd bleibt. (netQWOP-Entwickler berichten, dass viel Feintuning nötig war bei Dichte der Körper, Gelenk-Drehmomenten und Bodenreibung – dieses Know-how fließt hier ein.)

**Eingabesteuerung in Physik**: Wenn der Spieler einen Button drückt, wird im Physikmodell z.B. ein Motor oder Impuls am entsprechenden Gelenk aktiviert. Konkret könnte das bedeuten: Solange „Q" gedrückt, erzeugt das Hüftgelenk des linken Beins ein Drehmoment nach vorne. Lässt man los, kann ggf. eine Gegenkraft oder Schwerkraft das Bein zurückfallen lassen. Dieses Verhalten muss experimentell justiert werden, bis ein flüssiges (wenn auch schwieriges) Laufverhalten möglich ist.

Die Physik-Engine wird in jedem Frame mit kleiner Zeitschrittweite (z.B. 1/60 Sekunde) berechnet, um ein kontinuierliches Verhalten zu erzielen. Kollisionen (Läufer mit Boden, Läufer mit Hürde) werden automatisch von Box2D/Planck gehandhabt. Wichtig: Die Schuhe/Füße des Läufers brauchen Haftreibung auf dem Boden, damit er beim Abstoßen Vortrieb erhält. Gleichzeitig darf die Reibung nicht so hoch sein, dass der Fuß festklebt und der Läufer vornüber kippt. Diese Parameter sind Teil des Feintunings.

#### Grafik/Rendering
Die Spielgrafik wird über das HTML5 Canvas Element gerendert. Bei jedem Frame zeichnet der Client:

- Hintergrund (die Laufbahn, Himmel, 50m-Hürde, Ziellinie etc.).
- Die Läuferfigur: hier kann man die Körperteile als einfache Formen zeichnen (z.B. Linien für Beine, ein Kreis für den Kopf). Die aktuellen Koordinaten der Körperteile bekommt man aus der Physik-Engine (Planck gibt die Position und Rotation der Körper aus).
- Overlays/UI-Elemente (Distanztext, Buttons) können entweder via Canvas gezeichnet oder als HTML-Elemente über dem Canvas positioniert werden. Für klare Textanzeige (Distanz, Namen) bietet sich HTML an; für Buttons eventuell ebenfalls HTML/CSS mit transparenter Optik, die über dem Canvas liegt, um sie leichter klickbar zu machen.

#### Backend und Datenbank
Für die Highscore-Liste ist eine Datenbank erforderlich, die schnelle Reads/Writes von vielen kleinen Einträgen ermöglicht. Hier wird Google Cloud Firestore vorgeschlagen, ein NoSQL-Datenbankdienst, der direkt vom Web-Client angesprochen werden kann. Firestore speichert jeden Highscore-Eintrag als Dokument (z.B. in einer Collection "scores") mit Feldern wie name, email, distance, timestamp.

Vorteile von Firestore: Echtzeit-Updates (wenn gewünscht), automatische Skalierung, einfache Abfragesprache (z.B. Top-N Abfragen), und direkt in Web-Apps nutzbar mittels Firebase SDK. Zudem integriert es sich gut in Google Cloud.

Alternativen: Ein relationales DBMS auf Cloud SQL wäre überdimensioniert für dieses Schema, daher weniger ideal. Eine einfache JSON-Datei oder In-Memory-Liste auf dem Server wäre nicht persistenzsicher genug. Firestore bietet hier einen guten Mittelweg zwischen Einfachheit und Robustheit.

#### Server/Cloud Logic
Es gibt zwei Hauptwege, die Serverfunktion bereitzustellen:

**Node.js Server auf Google App Engine oder Cloud Run**: Hier könnte z.B. ein Express.js Server laufen, der die Web-App-Dateien ausliefert und eine REST API für Score-Submit und Score-List bereitstellt. Dieser Server könnte auch mittels Socket.io ausgestattet werden, falls in Zukunft ein Live-Modus oder Live-Updates der Highscore benötigt werden. (Im aktuellen asynchronen MVP ist Socket.io nicht unbedingt nötig.) Ein solcher Server würde auch das Versenden der E-Mails übernehmen (mithilfe einer Node-Library wie Nodemailer oder via API).

Vorteil: Alles unter Kontrolle einer eigenen App, flexible Logik, einfacher zu debuggen komplexe Abläufe.
Nachteil: Wartung des Servers, muss skalieren, könnte Idle-Kosten verursachen.

**Serverlose Architektur**: Nutzen von Firebase Hosting (für statische Files) + Firestore (DB) + Cloud Functions (für E-Mail-Versand oder andere Trigger). In diesem Modell gibt es keinen ständig laufenden Server. Der Client kommuniziert direkt mit Firestore (über Security-Rules abgesichert). Wenn ein neuer Score angelegt wird, triggert eine Cloud Function, die z.B. eine Mail verschickt oder Datenbereinigung vornimmt. Static Hosting auf Firebase/Cloud CDN sorgt für schnelle Auslieferung der Webseite weltweit.

Vorteil: Sehr wenig Admin-Aufwand, hohe Skalierbarkeit automatisch, Pay-per-use.
Nachteil: komplexere Debugging über verteilte Dienste, E-Mail-Versand muss als separate Function gehandhabt werden, ggf. etwas limitierter in Ablaufsteuerung.

In beiden Fällen ist Google Cloud die Plattform. Aufgrund der Anforderung, möglichst wenig Aufwand auf Client-Seite zu erzeugen, tendieren wir zu Lösung (2), da sie auch für den Nutzer sehr latenzarm ist (Firestore ist global verteilt, es kann Standort-nahe Server wählen). NetQWOP hat bereits erfolgreich Firestore für den Leaderboard eingesetzt, was als erprobter Weg gilt.

#### E-Mail-Dienst
Für das Versenden der Bestätigungs-/Beweis-E-Mails wird ein externer Mail-Dienst oder SMTP-Server benötigt. Möglichkeiten:

- Nutzung von SendGrid über eine Cloud Function (GCP bietet eine Integration für SendGrid).
- Oder Verwendung des hauseigenen Gmail/Workspace SMTP durch entsprechende Credentials in einer Cloud Function (Achtung auf Sicherheit).

Die Mail enthält im einfachsten Fall nur statischen Text mit Name und Distanz. Für Verifikationslinks müsste eine eindeutige ID generiert werden (z.B. die Dokument-ID des Firestore-Eintrags oder ein Hash), die in der Datenbank gespeichert ist. Klickt der Nutzer den Link, würde eine spezielle Bestätigungs-Function aufgerufen, die das Flag "verified" im Score-Datensatz auf true setzt. Wie erwähnt, kann die erste Version auch ohne tatsächlichen Bestätigungsschritt auskommen und die Mail rein informativ halten.

#### Cloud-Konfiguration
In Google Cloud sollten folgende Komponenten eingerichtet werden:

- Ein Firestore-Projekt mit einer Collection für Scores. Index auf distance absteigend für die Top-Listen Abfrage.
- (Optional) Firebase Authentication falls man doch noch Auth einführen will – hier aber nicht genutzt, da Email/Name ohne Login genügen.
- Eine oder mehrere Cloud Functions: z.B. sendVerificationEmail (onCreate Trigger bei Scores) und evtl. verifyScore (HTTP Trigger für den Bestätigungslink).
- Hosting/Server: entweder Firebase Hosting (connect domain, upload build) oder App Engine Standard (deploy Node app). Beide können via Cloud Build CI/CD automatisiert ausgerollt werden.
- Environment Variables/Configs: falls z.B. E-Mail API Keys notwendig sind, in Functions oder App Engine config einbinden, nicht im Code hardcoden.

## Ablaufszenarien

Hier werden ein paar typische Abläufe beschrieben, um die Zusammenarbeit der Komponenten zu verdeutlichen:

### Spielstart & Laden
Der Nutzer scannt z.B. auf einer Veranstaltung einen QR-Code, der auf die URL der Web-App zeigt (z.B. https://qwop-game.example.com). Der Browser lädt die statische HTML-Seite und zugehörige JS/CSS. Die App initialisiert das Spiel und zeigt evtl. einen Startbildschirm. Nimmt der Nutzer Eingaben vor (Name), werden diese lokal gespeichert. Die Physik-Engine wird gestartet, das Spiel wartet auf den Startschuss (der Nutzer drückt die erste Taste).

### Während des Spiels
Alle 250 Hz (Beispielwert) fragt der Client Touch-Eingaben ab (bzw. reagiert auf Touch-Events direkt bei Eintreten) und setzt Flags für Q/W/O/P gedrückt. Alle 60 Hz (Frame) wird die Physik-Engine um Δt weitergerechnet. Kräfte werden entsprechend der Input-Flags auf Gelenke angewandt. Nach jedem Physik-Step rendert das System den neuen Zustand auf dem Canvas. Parallel dazu wird die Distanz (Abstand des Rumpfes oder Startpunkt zum aktuellen Mittelpunkt des Läufers) berechnet und im HUD aktualisiert. Das Spiel läuft komplett eigenständig im Browser. Es finden in dieser Phase keine Server-Abfragen statt.

### Spielende (Lokale Verarbeitung)
Der Client registriert, dass der Läufer gestürzt ist (z.B. Physik-Event: Kopf oder Körper berührt Boden) oder 100 m erreicht hat (Distanz >= 100). Daraufhin stoppt die Physikberechnung. Eine Ergebnisanzeige (Game-Over Screen) erscheint. Hier sieht der Nutzer seine Distanz. Wenn diese Distanz > 0 ist und einer der Top-Scores sein könnte (oder immer, je nach Design), wird gefragt: „In Highscore eintragen? Name/Email bestätigen". Hat der Spieler noch keinen Namen eingegeben, holt die App dies jetzt nach.

### Highscore-Übermittlung
Wenn der Spieler auf „Eintragen" klickt, erstellt der Client ein Score-Objekt mit Name, Email, Distanz, Timestamp und sendet es an den Back-End Dienst. Bei direkter Firestore-Nutzung bedeutet das: firebase.firestore().collection("scores").add({...}). Bei REST API Nutzung: ein POST Request an z.B. /api/submitScore mit den Daten im JSON.

Angenommen Firestore direkt: Die Sicherheitsregeln erlauben diese Operation (z.B. .write erlaubt, wenn distance und name vorhanden und der Eintrag neu ist).

Firestore erzeugt einen neuen Dokumenteintrag oder updatet ein existierendes (je nach Implementierung der E-Mail-Einzigartigkeit – könnte auch erst als neu angelegt und dann mittels Cloud Function doppelte E-Mail-Einträge bereinigt werden).

### Serververarbeitung & E-Mail
Auf dem Server/Cloud passiert nun ggf. Folgendes:

- Falls mit Cloud Function: ein onCreate Trigger auf der "scores" Collection feuert. Die Function sendet eine E-Mail an die eingetragene Adresse mit dem vordefinierten Text (Name, Distanz, ggfs. Bestätigungslink mit DocID).
- Die neue Score wird in der DB gespeichert. Bei E-Mail-Uniqueness: Entweder die App hat vorher schon die bestehende Score geholt und entschieden zu patchen, oder die Cloud Function könnte erkennen, dass es schon einen Score mit dieser Email gibt. In letzterem Fall könnte sie z.B. vergleichen und den höheren Wert behalten, den niedrigeren löschen/archivieren.

### Highscore-Refresh am Client
Nach dem Submit könnte der Client die aktualisierte Top-Liste abrufen. Entweder hat er durch Firestore SDK ein Realtime-Listener auf die Score-Collection (mit Query auf Top 10), der jetzt die neuen Daten liefert – dann wird automatisch die Anzeige aktualisiert. Oder die App führt nach dem Submit einen simplen Refresh aus: z.B. firebase.firestore().collection("scores").orderBy("distance","desc").limit(10).get(), und aktualisiert damit die Highscore-Anzeige. Der Spieler sieht nun seinen Rang/Score im Kontext der Bestenliste.

### Neues Spiel
Der Spieler entscheidet sich, erneut zu spielen. Er klickt „Nochmal". Die App setzt die Physik-Engine zurück (alle Körper zurück an Startposition, Geschwindigkeit null, etc.), blendet den Game-Over-Screen aus und startet den nächsten Lauf. Name/Email sind schon gespeichert, sodass bei erneutem Eintragen nicht nochmal gefragt werden muss (außer er will Name ändern). Der Zyklus beginnt von vorn.

## Entwicklungsplanung und Vibe-Coding

Um dieses Projekt mittels Vibe-Coding (KI-unterstütztes Entwickeln durch natürliche Sprache) umsetzen zu können, muss die Spezifikation präzise genug sein – alle oben genannten Punkte dienen dazu, klare Vorgaben zu machen. Einige Empfehlungen für den Entwickler oder das KI-System im Entwicklungsprozess:

### Modular vorgehen
Zuerst die Basis-Spielmechanik implementieren (Physik & Steuerung), dann erst die Netzwerk/Cloud-Features hinzufügen. So kann man lokal testen, ob das QWOP-Gameplay stimmig ist, bevor man sich um Highscores kümmert.

### Physics Tuning iterativ
Startwerte für Masse, Kräfte, Winkelbeschränkungen setzen und ausprobieren. Die Erfahrung aus netQWOP zeigt, dass hier viel Feinschliff nötig ist. Also sollte man die Parameter leicht anpassbar halten (z.B. in einer Konfigurationsdatei oder Variablen), um sie im Test schnell ändern zu können.

### Firewalls zwischen Komponenten
Die Kommunikation zwischen Client und DB sollte erstmal einfach gehalten werden (z.B. unsichere Regeln während der Entwicklung), um die Funktionen zu testen. Später die Sicherheitsregeln festziehen. Ähnlich beim E-Mail: erst lokal mit Console-Log testen, dann echten Mailversand integrieren.

### Testing
Einheitstests für die Physiklogik sind schwer (weil es visuell und zufallsbehaftet ist), aber man kann z.B. prüfen, ob der Läufer unter Schwerkraft stabil steht oder ob Extremwerte auftreten (z.B. nach 10 Sekunden darf Position nicht NaN sein etc.). Wichtiger ist spielerisches manuelles Testen. Die Highscore-Features sollten getestet werden, indem man verschiedene Szenarien simuliert (z.B. zwei gleiche E-Mails nacheinander, größere Score zuerst, etc., um Update-Logik zu prüfen).

### User-Test
Da die Steuerung frustrierend sein kann, ein kleiner Nutzerkreis zum Feedback einbinden, um sicherzustellen, dass die Touch-Bedienung wirklich sauber funktioniert und Spaß macht.

## Fazit

Diese Spezifikation legt ausführlich dar, wie eine Multiplayer-fähige QWOP-Variante als Web-App realisiert werden kann. Das Design hält sich eng an das Originalspiel (physikalisch fordernde Bein-Steuerung, 100m-Lauf mit Hürdeneinlage) und ergänzt zeitgemäße Features: globale Bestenliste, mobile Touch-Steuerung und Cloud-Backend. Durch Einsatz moderner Web-Technologien (Canvas, WebSocket/Firestore, React optional) und Cloud-Dienste (Firestore, Cloud Functions) entsteht eine skalierbare Lösung, die leicht zugänglich ist und dennoch die nötige Leistung bietet, um das chaotische Gameplay flüssig umzusetzen.

Wird diese Spezifikation konsequent umgesetzt, erhält man ein spielbares Ergebnis, das den Charme von QWOP neu aufleben lässt und gleichzeitig Freunde weltweit zu einem indirekten Wettkampf einlädt. Dank detaillierter Vorgaben ist der Weg bereitet, das Projekt im Anschluss zügig zu entwickeln – sei es klassisch oder via Vibe-Coding, indem die hier formulierten Anforderungen Schritt für Schritt in Code überführt werden.

**Viel Erfolg beim Entwicklungsrennen – und passen Sie auf, dass QWOP nicht auf die Nase fällt!**