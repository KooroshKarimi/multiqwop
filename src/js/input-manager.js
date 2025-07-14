export class InputManager {
    constructor() {
        this.keys = {
            q: false,
            w: false,
            o: false,
            p: false
        };
        this.touchActive = false;
        this.controlButtons = {};
        this.callbacks = {
            onKeyPress: null,
            onKeyRelease: null
        };
    }

    init() {
        this.setupControlButtons();
        this.setupEventListeners();
        console.log('Input Manager initialized');
    }

    setupControlButtons() {
        // Get all control buttons
        const buttonIds = ['q-btn', 'w-btn', 'o-btn', 'p-btn'];
        
        buttonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                const key = button.dataset.key;
                this.controlButtons[key] = button;
            }
        });
    }

    setupEventListeners() {
        // Mouse events for desktop
        Object.keys(this.controlButtons).forEach(key => {
            const button = this.controlButtons[key];
            
            button.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.pressKey(key);
            });
            
            button.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.releaseKey(key);
            });
            
            button.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                this.releaseKey(key);
            });
        });

        // Touch events for mobile
        Object.keys(this.controlButtons).forEach(key => {
            const button = this.controlButtons[key];
            
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touchActive = true;
                this.pressKey(key);
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.touchActive = false;
                this.releaseKey(key);
            });
            
            button.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.touchActive = false;
                this.releaseKey(key);
            });
        });

        // Keyboard events (for development/testing)
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(key)) {
                e.preventDefault();
                this.pressKey(key);
            }
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(key)) {
                e.preventDefault();
                this.releaseKey(key);
            }
        });

        // Prevent default touch behaviors
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('control-btn')) {
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (e.target.classList.contains('control-btn')) {
                e.preventDefault();
            }
        }, { passive: false });

        // Handle window blur (release all keys when window loses focus)
        window.addEventListener('blur', () => {
            this.releaseAllKeys();
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.releaseAllKeys();
            }
        });
    }

    pressKey(key) {
        if (this.keys.hasOwnProperty(key) && !this.keys[key]) {
            this.keys[key] = true;
            this.updateButtonVisual(key, true);
            
            if (this.callbacks.onKeyPress) {
                this.callbacks.onKeyPress(key);
            }
            
            console.log(`Key pressed: ${key}`);
        }
    }

    releaseKey(key) {
        if (this.keys.hasOwnProperty(key) && this.keys[key]) {
            this.keys[key] = false;
            this.updateButtonVisual(key, false);
            
            if (this.callbacks.onKeyRelease) {
                this.callbacks.onKeyRelease(key);
            }
            
            console.log(`Key released: ${key}`);
        }
    }

    releaseAllKeys() {
        Object.keys(this.keys).forEach(key => {
            if (this.keys[key]) {
                this.releaseKey(key);
            }
        });
    }

    updateButtonVisual(key, isPressed) {
        const button = this.controlButtons[key];
        if (button) {
            if (isPressed) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    }

    isKeyPressed(key) {
        return this.keys[key] || false;
    }

    getPressedKeys() {
        return Object.keys(this.keys).filter(key => this.keys[key]);
    }

    // Set callbacks
    onKeyPress(callback) {
        this.callbacks.onKeyPress = callback;
    }

    onKeyRelease(callback) {
        this.callbacks.onKeyRelease = callback;
    }

    // Get current input state
    getInputState() {
        return { ...this.keys };
    }

    // Reset input state
    reset() {
        this.releaseAllKeys();
        this.touchActive = false;
    }

    // Check if any key is pressed
    isAnyKeyPressed() {
        return Object.values(this.keys).some(pressed => pressed);
    }

    // Get active keys count
    getActiveKeysCount() {
        return Object.values(this.keys).filter(pressed => pressed).length;
    }

    // Simulate key press (for testing)
    simulateKeyPress(key) {
        this.pressKey(key);
    }

    // Simulate key release (for testing)
    simulateKeyRelease(key) {
        this.releaseKey(key);
    }

    // Check if touch is active
    isTouchActive() {
        return this.touchActive;
    }

    // Get button element
    getButton(key) {
        return this.controlButtons[key] || null;
    }

    // Update button positions for responsive design
    updateButtonPositions() {
        const canvas = document.getElementById('game-canvas');
        if (!canvas) return;

        const canvasRect = canvas.getBoundingClientRect();
        const buttonSize = 60; // Default button size
        
        // Update button positions based on canvas position
        Object.keys(this.controlButtons).forEach(key => {
            const button = this.controlButtons[key];
            if (button) {
                // Ensure buttons stay within viewport
                const currentRect = button.getBoundingClientRect();
                
                // Adjust position if button is outside viewport
                if (currentRect.left < 0) {
                    button.style.left = '10px';
                }
                if (currentRect.right > window.innerWidth) {
                    button.style.right = '10px';
                }
                if (currentRect.top < 0) {
                    button.style.top = '10px';
                }
                if (currentRect.bottom > window.innerHeight) {
                    button.style.bottom = '10px';
                }
            }
        });
    }
}