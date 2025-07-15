export class Renderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.scale = 30; // pixels per meter
        this.camera = {
            x: 0,
            y: 0,
            width: 800,
            height: 400
        };
        
        this.colors = {
            background: '#87CEEB',
            ground: '#8B4513',
            runner: {
                head: '#FFB6C1',
                torso: '#FF6B6B',
                thigh: '#FF8C00',
                calf: '#FFA500',
                foot: '#8B4513'
            },
            hurdle: '#FF4500',
            finishLine: '#32CD32',
            track: '#90EE90'
        };
    }

    init() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        console.log('Renderer initialized successfully');
    }

    setupCanvas() {
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // Enable image smoothing
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    render(runnerState) {
        // Clear canvas
        this.clear();
        
        // Update camera position to follow runner
        this.updateCamera(runnerState);
        
        // Apply camera transform
        this.ctx.save();
        this.ctx.translate(-this.camera.x, 0);
        
        // Draw background
        this.drawBackground();
        
        // Draw track
        this.drawTrack();
        
        // Draw hurdle
        this.drawHurdle();
        
        // Draw finish line
        this.drawFinishLine();
        
        // Draw runner
        this.drawRunner(runnerState);
        
        // Draw distance markers
        this.drawDistanceMarkers();
        
        // Restore context
        this.ctx.restore();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateCamera(runnerState) {
        // Follow runner horizontally
        const targetX = runnerState.position.x * this.scale - this.canvas.width / 2;
        this.camera.x = Math.max(0, targetX);
    }

    drawBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width + this.camera.x, this.canvas.height);
    }

    drawTrack() {
        const trackY = this.canvas.height - 50;
        const trackHeight = 50;
        
        // Track background
        this.ctx.fillStyle = this.colors.track;
        this.ctx.fillRect(0, trackY, this.canvas.width + this.camera.x, trackHeight);
        
        // Track lines (every 10 meters)
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        for (let x = 0; x <= 100; x += 10) {
            const screenX = x * this.scale;
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, trackY);
            this.ctx.lineTo(screenX, trackY + trackHeight);
            this.ctx.stroke();
        }
        
        this.ctx.setLineDash([]);
    }

    drawHurdle() {
        const hurdleX = 50 * this.scale;
        const hurdleY = this.canvas.height - 100;
        const hurdleWidth = 15;
        const hurdleHeight = 30;
        
        // Hurdle shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(hurdleX + 2, hurdleY + 2, hurdleWidth, hurdleHeight);
        
        // Hurdle
        this.ctx.fillStyle = this.colors.hurdle;
        this.ctx.fillRect(hurdleX, hurdleY, hurdleWidth, hurdleHeight);
        
        // Hurdle details
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(hurdleX, hurdleY, hurdleWidth, hurdleHeight);
    }

    drawFinishLine() {
        const finishX = 100 * this.scale;
        const finishY = this.canvas.height - 80;
        const finishWidth = 5;
        const finishHeight = 60;
        
        // Finish line shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(finishX + 2, finishY + 2, finishWidth, finishHeight);
        
        // Finish line
        this.ctx.fillStyle = this.colors.finishLine;
        this.ctx.fillRect(finishX, finishY, finishWidth, finishHeight);
        
        // Checkered pattern
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 1;
        for (let y = 0; y < finishHeight; y += 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(finishX, finishY + y);
            this.ctx.lineTo(finishX + finishWidth, finishY + y);
            this.ctx.stroke();
        }
    }

    drawRunner(runnerState) {
        // Get physics world and body parts
        const world = runnerState.world;
        const bodyParts = runnerState.bodyParts;
        
        console.log('Drawing runner:', { world: !!world, bodyParts: !!bodyParts, position: runnerState.position });
        
        if (!world || !bodyParts) {
            // Draw mock runner if physics data not available
            console.log('Using mock runner');
            this.drawMockRunner(runnerState);
            return;
        }
        
        // Draw each body part
        Object.keys(bodyParts).forEach(partName => {
            const body = bodyParts[partName];
            const position = body.getPosition();
            const angle = body.getAngle();
            
            this.drawBodyPart(partName, position, angle);
        });
    }

    drawMockRunner(runnerState) {
        // Draw a simple mock runner when physics data is not available
        const x = runnerState.position.x * this.scale;
        const y = this.canvas.height - 150 - runnerState.position.y * this.scale;
        
        // Head
        this.ctx.fillStyle = this.colors.runner.head;
        this.ctx.beginPath();
        this.ctx.arc(x, y - 40, 15, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Torso
        this.ctx.fillStyle = this.colors.runner.torso;
        this.ctx.fillRect(x - 20, y - 20, 40, 40);
        
        // Arms
        this.ctx.fillStyle = this.colors.runner.thigh;
        this.ctx.fillRect(x - 30, y - 10, 10, 30);
        this.ctx.fillRect(x + 20, y - 10, 10, 30);
        
        // Legs
        this.ctx.fillStyle = this.colors.runner.calf;
        this.ctx.fillRect(x - 15, y + 20, 8, 25);
        this.ctx.fillRect(x + 7, y + 20, 8, 25);
        
        // Feet
        this.ctx.fillStyle = this.colors.runner.foot;
        this.ctx.fillRect(x - 20, y + 45, 12, 5);
        this.ctx.fillRect(x + 8, y + 45, 12, 5);
    }

    drawBodyPart(partName, position, angle) {
        const x = position.x * this.scale;
        const y = this.canvas.height - 50 - position.y * this.scale;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);
        
        // Set color based on body part
        let color = this.colors.runner.torso;
        let width = 20;
        let height = 30;
        
        switch (partName) {
            case 'head':
                color = this.colors.runner.head;
                width = 15;
                height = 15;
                break;
            case 'torso':
                color = this.colors.runner.torso;
                width = 20;
                height = 30;
                break;
            case 'leftThigh':
            case 'rightThigh':
                color = this.colors.runner.thigh;
                width = 8;
                height = 20;
                break;
            case 'leftCalf':
            case 'rightCalf':
                color = this.colors.runner.calf;
                width = 6;
                height = 18;
                break;
            case 'leftFoot':
            case 'rightFoot':
                color = this.colors.runner.foot;
                width = 12;
                height = 3;
                break;
        }
        
        // Draw body part
        this.ctx.fillStyle = color;
        this.ctx.fillRect(-width/2, -height/2, width, height);
        
        // Add outline
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(-width/2, -height/2, width, height);
        
        this.ctx.restore();
    }

    drawDistanceMarkers() {
        // Draw distance markers every 10 meters
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        for (let distance = 0; distance <= 100; distance += 10) {
            const x = distance * this.scale;
            const y = this.canvas.height - 10;
            
            this.ctx.fillText(`${distance}m`, x, y);
        }
    }

    handleResize() {
        // Get canvas container
        const container = this.canvas.parentElement;
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        
        // Update canvas size to fit container
        this.canvas.width = containerRect.width;
        this.canvas.height = containerRect.height;
        
        // Update camera dimensions
        this.camera.width = this.canvas.width;
        this.camera.height = this.canvas.height;
        
        console.log('Canvas resized to:', this.canvas.width, 'x', this.canvas.height);
    }

    // Utility methods
    worldToScreen(worldPos) {
        return {
            x: worldPos.x * this.scale,
            y: this.canvas.height - worldPos.y * this.scale
        };
    }

    screenToWorld(screenPos) {
        return {
            x: screenPos.x / this.scale,
            y: (this.canvas.height - screenPos.y) / this.scale
        };
    }

    // Get canvas context for external use
    getContext() {
        return this.ctx;
    }

    // Get canvas element
    getCanvas() {
        return this.canvas;
    }

    // Set scale
    setScale(scale) {
        this.scale = scale;
    }

    // Get current scale
    getScale() {
        return this.scale;
    }

    // Cleanup
    destroy() {
        this.canvas = null;
        this.ctx = null;
        console.log('Renderer destroyed');
    }
}