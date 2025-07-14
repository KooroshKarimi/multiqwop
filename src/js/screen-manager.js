export class ScreenManager {
    constructor() {
        this.currentScreen = null;
        this.screens = {};
    }

    init() {
        // Get all screen elements
        const screenElements = document.querySelectorAll('.screen');
        
        screenElements.forEach(screen => {
            const screenId = screen.id;
            this.screens[screenId] = screen;
        });

        console.log('Screen Manager initialized with screens:', Object.keys(this.screens));
    }

    showScreen(screenId) {
        // Hide current screen
        if (this.currentScreen) {
            this.currentScreen.classList.remove('active');
        }

        // Show new screen
        const targetScreen = this.screens[screenId];
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = targetScreen;
            console.log(`Switched to screen: ${screenId}`);
        } else {
            console.error(`Screen not found: ${screenId}`);
        }
    }

    getCurrentScreen() {
        return this.currentScreen ? this.currentScreen.id : null;
    }

    isScreenActive(screenId) {
        const screen = this.screens[screenId];
        return screen && screen.classList.contains('active');
    }

    // Update distance display
    updateDistance(distance) {
        const distanceElement = document.getElementById('distance');
        const finalDistanceElement = document.getElementById('final-distance');
        
        if (distanceElement) {
            distanceElement.textContent = `${distance.toFixed(1)}m`;
        }
        
        if (finalDistanceElement) {
            finalDistanceElement.textContent = `${distance.toFixed(1)}m`;
        }
    }

    // Update result message
    updateResultMessage(distance, isSuccess = false) {
        const resultMessageElement = document.getElementById('result-message');
        
        if (resultMessageElement) {
            let message = '';
            let className = '';
            
            if (distance >= 100) {
                message = '🎉 Ziel erreicht! Du hast es geschafft! 🎉';
                className = 'success';
            } else if (distance >= 50) {
                message = `Gut gemacht! Du hast ${distance.toFixed(1)}m erreicht!`;
                className = 'success';
            } else if (distance >= 10) {
                message = `Nicht schlecht! ${distance.toFixed(1)}m sind ein guter Start!`;
                className = 'success';
            } else {
                message = 'Das war knapp! Versuche es noch einmal!';
                className = 'failure';
            }
            
            resultMessageElement.textContent = message;
            resultMessageElement.className = `result-message ${className}`;
        }
    }

    // Update highscores list
    updateHighscoresList(highscores) {
        const highscoresListElement = document.getElementById('highscores-list');
        
        if (highscoresListElement) {
            highscoresListElement.innerHTML = '';
            
            if (highscores.length === 0) {
                highscoresListElement.innerHTML = '<p>Noch keine Scores vorhanden. Sei der Erste!</p>';
                return;
            }
            
            highscores.forEach((score, index) => {
                const rank = index + 1;
                const date = new Date(score.timestamp).toLocaleDateString('de-DE');
                
                const scoreElement = document.createElement('div');
                scoreElement.className = 'highscore-item';
                scoreElement.innerHTML = `
                    <span class="highscore-rank">#${rank}</span>
                    <span class="highscore-name">${this.escapeHtml(score.name)}</span>
                    <span class="highscore-distance">${score.distance.toFixed(1)}m</span>
                    <span class="highscore-date">${date}</span>
                `;
                
                highscoresListElement.appendChild(scoreElement);
            });
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Get form data
    getFormData() {
        const nameInput = document.getElementById('player-name');
        const emailInput = document.getElementById('player-email');
        
        return {
            name: nameInput ? nameInput.value.trim() : '',
            email: emailInput ? emailInput.value.trim() : ''
        };
    }

    // Set form data
    setFormData(name, email) {
        const nameInput = document.getElementById('player-name');
        const emailInput = document.getElementById('player-email');
        
        if (nameInput && name) {
            nameInput.value = name;
        }
        
        if (emailInput && email) {
            emailInput.value = email;
        }
    }

    // Clear form data
    clearFormData() {
        const nameInput = document.getElementById('player-name');
        const emailInput = document.getElementById('player-email');
        
        if (nameInput) {
            nameInput.value = '';
        }
        
        if (emailInput) {
            emailInput.value = '';
        }
    }

    // Show loading state
    showLoading(message = 'Lade...') {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            const loadingContent = loadingScreen.querySelector('.loading-content p');
            if (loadingContent) {
                loadingContent.textContent = message;
            }
            loadingScreen.classList.add('active');
        }
    }

    // Hide loading state
    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
        }
    }

    // Show error message
    showError(message) {
        const currentScreen = this.getCurrentScreen();
        if (currentScreen) {
            const screen = this.screens[currentScreen];
            if (screen) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(255, 71, 87, 0.9);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    z-index: 1000;
                    font-weight: bold;
                `;
                errorDiv.textContent = message;
                
                document.body.appendChild(errorDiv);
                
                // Remove error message after 3 seconds
                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.parentNode.removeChild(errorDiv);
                    }
                }, 3000);
            }
        }
    }

    // Show success message
    showSuccess(message) {
        const currentScreen = this.getCurrentScreen();
        if (currentScreen) {
            const screen = this.screens[currentScreen];
            if (screen) {
                const successDiv = document.createElement('div');
                successDiv.className = 'success-message';
                successDiv.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(46, 213, 115, 0.9);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    z-index: 1000;
                    font-weight: bold;
                `;
                successDiv.textContent = message;
                
                document.body.appendChild(successDiv);
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    if (successDiv.parentNode) {
                        successDiv.parentNode.removeChild(successDiv);
                    }
                }, 3000);
            }
        }
    }
}