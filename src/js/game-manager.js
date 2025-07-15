import { PhysicsEngine } from './physics-engine.js';
import { Renderer } from './renderer.js';

export class GameManager {
    constructor(screenManager, firebaseService, inputManager) {
        this.screenManager = screenManager;
        this.firebaseService = firebaseService;
        this.inputManager = inputManager;
        
        this.physicsEngine = null;
        this.renderer = null;
        
        this.gameState = {
            isRunning: false,
            isPaused: false,
            currentDistance: 0,
            finalDistance: 0,
            gameStartTime: 0,
            lastUpdateTime: 0
        };
        
        this.playerData = {
            name: '',
            email: ''
        };
        
        this.animationId = null;
    }

    async init() {
        try {
            // Initialize physics engine
            this.physicsEngine = new PhysicsEngine();
            await this.physicsEngine.init();
            
            // Initialize renderer
            this.renderer = new Renderer();
            this.renderer.init();
            
            // Set up input callbacks
            this.inputManager.onKeyPress((key) => {
                this.handleKeyPress(key);
            });
            
            this.inputManager.onKeyRelease((key) => {
                this.handleKeyRelease(key);
            });
            
            console.log('Game Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Game Manager:', error);
            throw error;
        }
    }

    startGame() {
        try {
            console.log('Starting new game...');
            console.log('GameManager state:', this.gameState);
            console.log('PhysicsEngine available:', !!this.physicsEngine);
            console.log('Renderer available:', !!this.renderer);
            
            // Reset game state
            this.gameState.isRunning = true;
            this.gameState.isPaused = false;
            this.gameState.currentDistance = 0;
            this.gameState.finalDistance = 0;
            this.gameState.gameStartTime = Date.now();
            this.gameState.lastUpdateTime = performance.now();
            
            // Reset physics
            this.physicsEngine.reset();
            
            // Reset input
            this.inputManager.reset();
            
            // Show game screen
            this.screenManager.showScreen('game-screen');
            
            // Start game loop
            this.startGameLoop();
            
            console.log('Game started successfully');
        } catch (error) {
            console.error('Failed to start game:', error);
            this.screenManager.showError('Fehler beim Spielstart');
        }
    }

    resetGame() {
        if (this.gameState.isRunning) {
            this.startGame();
        }
    }

    pauseGame() {
        if (this.gameState.isRunning && !this.gameState.isPaused) {
            this.gameState.isPaused = true;
            console.log('Game paused');
        }
    }

    resumeGame() {
        if (this.gameState.isRunning && this.gameState.isPaused) {
            this.gameState.isPaused = false;
            this.gameState.lastUpdateTime = performance.now();
            console.log('Game resumed');
        }
    }

    stopGame() {
        this.gameState.isRunning = false;
        this.gameState.isPaused = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        console.log('Game stopped');
    }

    startGameLoop() {
        console.log('Starting game loop...');
        const gameLoop = (currentTime) => {
            if (!this.gameState.isRunning) {
                return;
            }
            
            if (this.gameState.isPaused) {
                this.animationId = requestAnimationFrame(gameLoop);
                return;
            }
            
            const deltaTime = currentTime - this.gameState.lastUpdateTime;
            this.gameState.lastUpdateTime = currentTime;
            
            // Update physics
            this.physicsEngine.update(deltaTime);
            
            // Update distance
            this.updateDistance();
            
            // Render frame
            this.renderer.render(this.physicsEngine.getRunnerState());
            
            // Check game end conditions
            if (this.checkGameEnd()) {
                this.endGame();
                return;
            }
            
            // Continue game loop
            this.animationId = requestAnimationFrame(gameLoop);
        };
        
        this.animationId = requestAnimationFrame(gameLoop);
    }

    updateDistance() {
        const runnerState = this.physicsEngine.getRunnerState();
        this.gameState.currentDistance = runnerState.distance;
        
        // Update UI
        this.screenManager.updateDistance(this.gameState.currentDistance);
    }

    checkGameEnd() {
        const runnerState = this.physicsEngine.getRunnerState();
        
        // Check if runner fell (head or body touched ground)
        if (runnerState.hasFallen) {
            return true;
        }
        
        // Check if runner reached 100m
        if (runnerState.distance >= 100) {
            return true;
        }
        
        return false;
    }

    endGame() {
        console.log('Game ended');
        
        this.stopGame();
        
        // Set final distance
        this.gameState.finalDistance = this.gameState.currentDistance;
        
        // Update final distance display
        this.screenManager.updateDistance(this.gameState.finalDistance);
        
        // Update result message
        this.screenManager.updateResultMessage(this.gameState.finalDistance);
        
        // Show game over screen
        this.screenManager.showScreen('game-over-screen');
    }

    handleKeyPress(key) {
        if (!this.gameState.isRunning || this.gameState.isPaused) {
            return;
        }
        
        // Apply forces to physics engine based on key
        switch (key) {
            case 'q':
                this.physicsEngine.applyLeftThighForce();
                break;
            case 'w':
                this.physicsEngine.applyRightThighForce();
                break;
            case 'o':
                this.physicsEngine.applyLeftCalfForce();
                break;
            case 'p':
                this.physicsEngine.applyRightCalfForce();
                break;
        }
    }

    handleKeyRelease(key) {
        if (!this.gameState.isRunning || this.gameState.isPaused) {
            return;
        }
        
        // Stop forces when key is released
        switch (key) {
            case 'q':
                this.physicsEngine.stopLeftThighForce();
                break;
            case 'w':
                this.physicsEngine.stopRightThighForce();
                break;
            case 'o':
                this.physicsEngine.stopLeftCalfForce();
                break;
            case 'p':
                this.physicsEngine.stopRightCalfForce();
                break;
        }
    }

    async showHighscores() {
        try {
            this.screenManager.showLoading('Lade Highscores...');
            
            const highscores = await this.firebaseService.getHighscores(20);
            this.screenManager.updateHighscoresList(highscores);
            
            this.screenManager.hideLoading();
            this.screenManager.showScreen('highscores-screen');
            
        } catch (error) {
            console.error('Failed to load highscores:', error);
            this.screenManager.hideLoading();
            this.screenManager.showError('Fehler beim Laden der Highscores');
        }
    }

    async submitScore() {
        try {
            const formData = this.screenManager.getFormData();
            
            // Validate form data
            if (!formData.name || !formData.email) {
                this.screenManager.showError('Bitte fülle alle Felder aus');
                return;
            }
            
            if (!this.firebaseService.validateEmail(formData.email)) {
                this.screenManager.showError('Bitte gib eine gültige E-Mail-Adresse ein');
                return;
            }
            
            if (!this.firebaseService.validateName(formData.name)) {
                this.screenManager.showError('Name muss zwischen 2 und 50 Zeichen lang sein');
                return;
            }
            
            // Store player data
            this.playerData.name = formData.name;
            this.playerData.email = formData.email;
            
            this.screenManager.showLoading('Score wird eingetragen...');
            
            const result = await this.firebaseService.submitScore({
                name: formData.name,
                email: formData.email,
                distance: this.gameState.finalDistance
            });
            
            this.screenManager.hideLoading();
            
            if (result.success) {
                if (result.updated) {
                    this.screenManager.showSuccess('Score erfolgreich eingetragen!');
                } else {
                    this.screenManager.showSuccess('Score nicht besser als dein bisheriger Rekord');
                }
            } else {
                this.screenManager.showError('Fehler beim Eintragen des Scores');
            }
            
        } catch (error) {
            console.error('Failed to submit score:', error);
            this.screenManager.hideLoading();
            this.screenManager.showError('Fehler beim Eintragen des Scores');
        }
    }

    handleResize() {
        if (this.renderer) {
            this.renderer.handleResize();
        }
        
        if (this.inputManager) {
            this.inputManager.updateButtonPositions();
        }
    }

    isGameRunning() {
        return this.gameState.isRunning;
    }

    isGamePaused() {
        return this.gameState.isPaused;
    }

    getCurrentDistance() {
        return this.gameState.currentDistance;
    }

    getFinalDistance() {
        return this.gameState.finalDistance;
    }

    getGameState() {
        return { ...this.gameState };
    }

    // Load player data from localStorage
    loadPlayerData() {
        try {
            const savedName = localStorage.getItem('qwop_player_name');
            const savedEmail = localStorage.getItem('qwop_player_email');
            
            if (savedName && savedEmail) {
                this.playerData.name = savedName;
                this.playerData.email = savedEmail;
                this.screenManager.setFormData(savedName, savedEmail);
            }
        } catch (error) {
            console.warn('Failed to load player data:', error);
        }
    }

    // Save player data to localStorage
    savePlayerData() {
        try {
            if (this.playerData.name) {
                localStorage.setItem('qwop_player_name', this.playerData.name);
            }
            if (this.playerData.email) {
                localStorage.setItem('qwop_player_email', this.playerData.email);
            }
        } catch (error) {
            console.warn('Failed to save player data:', error);
        }
    }

    // Cleanup
    destroy() {
        this.stopGame();
        
        if (this.physicsEngine) {
            this.physicsEngine.destroy();
        }
        
        if (this.renderer) {
            this.renderer.destroy();
        }
        
        console.log('Game Manager destroyed');
    }
}