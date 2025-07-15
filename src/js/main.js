import { GameManager } from './game-manager.js';
import { ScreenManager } from './screen-manager.js';
import { FirebaseService } from './firebase-service.js';
import { InputManager } from './input-manager.js';
import { PhysicsTest } from './physics-test.js';

class QWOPGame {
    constructor() {
        this.gameManager = null;
        this.screenManager = null;
        this.firebaseService = null;
        this.inputManager = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            console.log('Initializing QWOP Multiplayer Game...');
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize Firebase
            this.firebaseService = new FirebaseService();
            await this.firebaseService.init();
            
            // Initialize screen manager
            this.screenManager = new ScreenManager();
            this.screenManager.init();
            
            // Initialize input manager
            this.inputManager = new InputManager();
            this.inputManager.init();
            
            // Initialize game manager
            this.gameManager = new GameManager(
                this.screenManager,
                this.firebaseService,
                this.inputManager
            );
            await this.gameManager.init();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Hide loading screen and show start screen
            this.hideLoadingScreen();
            this.screenManager.showScreen('start-screen');
            
            this.isInitialized = true;
            console.log('QWOP Game initialized successfully!');
            
        } catch (error) {
            console.error('Failed to initialize QWOP Game:', error);
            this.showErrorScreen(error.message);
        }
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('active');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
        }
    }

    showErrorScreen(message) {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
            loadingScreen.innerHTML = `
                <div class="loading-content">
                    <h2>Fehler beim Laden</h2>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn btn-primary">Neu laden</button>
                </div>
            `;
            loadingScreen.classList.add('active');
        }
    }

    setupEventListeners() {
        // Start game button
        const startGameBtn = document.getElementById('start-game-btn');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                this.gameManager.startGame();
            });
        }

        // Show highscores button
        const showHighscoresBtn = document.getElementById('show-highscores-btn');
        if (showHighscoresBtn) {
            showHighscoresBtn.addEventListener('click', () => {
                this.gameManager.showHighscores();
            });
        }

        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.gameManager.resetGame();
            });
        }

        // Play again button
        const playAgainBtn = document.getElementById('play-again-btn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.gameManager.startGame();
            });
        }

        // View highscores from game over
        const viewHighscoresBtn = document.getElementById('view-highscores-btn');
        if (viewHighscoresBtn) {
            viewHighscoresBtn.addEventListener('click', () => {
                this.gameManager.showHighscores();
            });
        }

        // Back to menu button
        const backToMenuBtn = document.getElementById('back-to-menu-btn');
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => {
                this.screenManager.showScreen('start-screen');
            });
        }

        // Play from highscores button
        const playFromHighscoresBtn = document.getElementById('play-from-highscores-btn');
        if (playFromHighscoresBtn) {
            playFromHighscoresBtn.addEventListener('click', () => {
                this.gameManager.startGame();
            });
        }

        // Submit score button
        const submitScoreBtn = document.getElementById('submit-score-btn');
        if (submitScoreBtn) {
            submitScoreBtn.addEventListener('click', () => {
                this.gameManager.submitScore();
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.gameManager && this.gameManager.isGameRunning()) {
                this.gameManager.handleResize();
            }
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (this.gameManager && this.gameManager.isGameRunning()) {
                    this.gameManager.handleResize();
                }
            }, 100);
        });

        // Prevent context menu on canvas
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            canvas.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        }

        // Handle visibility change (pause game when tab is not active)
        document.addEventListener('visibilitychange', () => {
            if (this.gameManager && this.gameManager.isGameRunning()) {
                if (document.hidden) {
                    this.gameManager.pauseGame();
                } else {
                    this.gameManager.resumeGame();
                }
            }
        });
    }

    // Public method to get game instance
    static getInstance() {
        if (!QWOPGame.instance) {
            QWOPGame.instance = new QWOPGame();
        }
        return QWOPGame.instance;
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const game = QWOPGame.getInstance();
    await game.init();
});

// Export for potential external use
window.QWOPGame = QWOPGame;