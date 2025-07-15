import * as planck from 'planck-js';

export class PhysicsEngine {
    constructor() {
        this.world = null;
        this.runner = null;
        this.ground = null;
        this.hurdle = null;
        this.finishLine = null;
        
        this.forces = {
            leftThigh: false,
            rightThigh: false,
            leftCalf: false,
            rightCalf: false
        };
        
        this.runnerState = {
            distance: 0,
            hasFallen: false,
            position: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 }
        };
        
        this.scale = 30; // pixels per meter
        this.gravity = 9.81;
        this.timeStep = 1/60;
        
        this.runnerParts = {};
        this.joints = {};
    }

    async init() {
        try {
            // Create physics world
            this.world = new planck.World({
                gravity: planck.Vec2(0, -this.gravity)
            });
            
            // Create ground
            this.createGround();
            
            // Create hurdle at 50m
            this.createHurdle();
            
            // Create finish line at 100m
            this.createFinishLine();
            
            // Create runner
            this.createRunner();
            
            console.log('Physics Engine initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Physics Engine:', error);
            throw error;
        }
    }

    createGround() {
        const groundShape = planck.Box(100, 1);
        this.ground = this.world.createBody({
            type: 'static',
            position: planck.Vec2(0, -0.5)
        });
        this.ground.createFixture({
            shape: groundShape,
            density: 0,
            friction: 0.8,
            restitution: 0.1
        });
    }

    createHurdle() {
        const hurdleShape = planck.Box(0.5, 1);
        this.hurdle = this.world.createBody({
            type: 'static',
            position: planck.Vec2(50, 0.5)
        });
        this.hurdle.createFixture({
            shape: hurdleShape,
            density: 0,
            friction: 0.3,
            restitution: 0.2
        });
    }

    createFinishLine() {
        const finishShape = planck.Box(0.1, 2);
        this.finishLine = this.world.createBody({
            type: 'static',
            position: planck.Vec2(100, 1)
        });
        this.finishLine.createFixture({
            shape: finishShape,
            density: 0,
            friction: 0,
            restitution: 0,
            isSensor: true
        });
    }

    createRunner() {
        // Create runner body parts
        this.runnerParts = {
            head: this.createBodyPart(0.3, 0.3, 0.5, 1.8, 0.5), // head
            torso: this.createBodyPart(0.4, 0.6, 0.5, 1.2, 1.0), // torso
            leftThigh: this.createBodyPart(0.15, 0.4, 0.3, 0.8, 0.8), // left thigh
            rightThigh: this.createBodyPart(0.15, 0.4, 0.7, 0.8, 0.8), // right thigh
            leftCalf: this.createBodyPart(0.12, 0.35, 0.3, 0.4, 0.6), // left calf
            rightCalf: this.createBodyPart(0.12, 0.35, 0.7, 0.4, 0.6), // right calf
            leftFoot: this.createBodyPart(0.2, 0.1, 0.3, 0.05, 0.1), // left foot
            rightFoot: this.createBodyPart(0.2, 0.1, 0.7, 0.05, 0.1) // right foot
        };

        // Create joints
        this.joints = {
            neck: this.createJoint(this.runnerParts.head, this.runnerParts.torso, 0.5, 1.5),
            leftHip: this.createJoint(this.runnerParts.torso, this.runnerParts.leftThigh, 0.3, 0.8),
            rightHip: this.createJoint(this.runnerParts.torso, this.runnerParts.rightThigh, 0.7, 0.8),
            leftKnee: this.createJoint(this.runnerParts.leftThigh, this.runnerParts.leftCalf, 0.3, 0.4),
            rightKnee: this.createJoint(this.runnerParts.rightThigh, this.runnerParts.rightCalf, 0.7, 0.4),
            leftAnkle: this.createJoint(this.runnerParts.leftCalf, this.runnerParts.leftFoot, 0.3, 0.05),
            rightAnkle: this.createJoint(this.runnerParts.rightCalf, this.runnerParts.rightFoot, 0.7, 0.05)
        };

        // Set up joint limits
        this.setupJointLimits();
    }

    createBodyPart(width, height, x, y, density = 1.0) {
        const shape = planck.Box(width / 2, height / 2);
        const body = this.world.createBody({
            type: 'dynamic',
            position: planck.Vec2(x, y),
            fixedRotation: false
        });
        
        body.createFixture({
            shape: shape,
            density: density,
            friction: 0.3,
            restitution: 0.1
        });
        
        return body;
    }

    createJoint(bodyA, bodyB, x, y) {
        return this.world.createJoint(planck.RevoluteJoint({
            bodyA: bodyA,
            bodyB: bodyB,
            localAnchorA: planck.Vec2(0, 0),
            localAnchorB: planck.Vec2(0, 0),
            referenceAngle: 0,
            enableLimit: true,
            lowerAngle: -Math.PI / 2,
            upperAngle: Math.PI / 2
        }));
    }

    setupJointLimits() {
        // Hip joints (thigh movement)
        this.joints.leftHip.setLimits(-Math.PI / 3, Math.PI / 3);
        this.joints.rightHip.setLimits(-Math.PI / 3, Math.PI / 3);
        
        // Knee joints (calf movement)
        this.joints.leftKnee.setLimits(-Math.PI / 6, Math.PI / 2);
        this.joints.rightKnee.setLimits(-Math.PI / 6, Math.PI / 2);
        
        // Ankle joints (foot movement)
        this.joints.leftAnkle.setLimits(-Math.PI / 4, Math.PI / 4);
        this.joints.rightAnkle.setLimits(-Math.PI / 4, Math.PI / 4);
        
        // Neck joint (head movement)
        this.joints.neck.setLimits(-Math.PI / 6, Math.PI / 6);
    }

    update(deltaTime) {
        // Step physics world
        this.world.step(this.timeStep);
        
        // Update runner state
        this.updateRunnerState();
        
        // Apply forces based on input
        this.applyForces();
    }

    updateRunnerState() {
        // Get torso position (main body part)
        const torsoPos = this.runnerParts.torso.getPosition();
        const torsoVel = this.runnerParts.torso.getLinearVelocity();
        
        // Calculate distance (x position in meters)
        this.runnerState.distance = Math.max(0, torsoPos.x);
        this.runnerState.position = { x: torsoPos.x, y: torsoPos.y };
        this.runnerState.velocity = { x: torsoVel.x, y: torsoVel.y };
        
        // Check if runner has fallen
        this.runnerState.hasFallen = this.checkIfFallen();
    }

    checkIfFallen() {
        // Check if head or torso is below ground level
        const headPos = this.runnerParts.head.getPosition();
        const torsoPos = this.runnerParts.torso.getPosition();
        
        return headPos.y < 0.5 || torsoPos.y < 0.3;
    }

    applyForces() {
        const forceMagnitude = 50;
        const torqueMagnitude = 20;
        
        // Apply forces to joints based on input
        if (this.forces.leftThigh) {
            this.joints.leftHip.setMotorSpeed(2);
            this.joints.leftHip.setMaxMotorTorque(torqueMagnitude);
            this.joints.leftHip.enableMotor(true);
        } else {
            this.joints.leftHip.enableMotor(false);
        }
        
        if (this.forces.rightThigh) {
            this.joints.rightHip.setMotorSpeed(2);
            this.joints.rightHip.setMaxMotorTorque(torqueMagnitude);
            this.joints.rightHip.enableMotor(true);
        } else {
            this.joints.rightHip.enableMotor(false);
        }
        
        if (this.forces.leftCalf) {
            this.joints.leftKnee.setMotorSpeed(-1);
            this.joints.leftKnee.setMaxMotorTorque(torqueMagnitude);
            this.joints.leftKnee.enableMotor(true);
        } else {
            this.joints.leftKnee.enableMotor(false);
        }
        
        if (this.forces.rightCalf) {
            this.joints.rightKnee.setMotorSpeed(-1);
            this.joints.rightKnee.setMaxMotorTorque(torqueMagnitude);
            this.joints.rightKnee.enableMotor(true);
        } else {
            this.joints.rightKnee.enableMotor(false);
        }
    }

    // Force application methods
    applyLeftThighForce() {
        this.forces.leftThigh = true;
    }

    applyRightThighForce() {
        this.forces.rightThigh = true;
    }

    applyLeftCalfForce() {
        this.forces.leftCalf = true;
    }

    applyRightCalfForce() {
        this.forces.rightCalf = true;
    }

    stopLeftThighForce() {
        this.forces.leftThigh = false;
    }

    stopRightThighForce() {
        this.forces.rightThigh = false;
    }

    stopLeftCalfForce() {
        this.forces.leftCalf = false;
    }

    stopRightCalfForce() {
        this.forces.rightCalf = false;
    }

    getRunnerState() {
        return { ...this.runnerState };
    }

    getAllBodyParts() {
        return this.runnerParts;
    }

    getAllJoints() {
        return this.joints;
    }

    getWorld() {
        return this.world;
    }

    reset() {
        // Reset forces
        this.forces = {
            leftThigh: false,
            rightThigh: false,
            leftCalf: false,
            rightCalf: false
        };
        
        // Reset runner state
        this.runnerState = {
            distance: 0,
            hasFallen: false,
            position: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 }
        };
        
        // Reset all body parts to starting position
        const startPositions = {
            head: { x: 0.5, y: 1.8 },
            torso: { x: 0.5, y: 1.2 },
            leftThigh: { x: 0.3, y: 0.8 },
            rightThigh: { x: 0.7, y: 0.8 },
            leftCalf: { x: 0.3, y: 0.4 },
            rightCalf: { x: 0.7, y: 0.4 },
            leftFoot: { x: 0.3, y: 0.05 },
            rightFoot: { x: 0.7, y: 0.05 }
        };
        
        Object.keys(this.runnerParts).forEach(partName => {
            const body = this.runnerParts[partName];
            const pos = startPositions[partName];
            
            body.setPosition(planck.Vec2(pos.x, pos.y));
            body.setLinearVelocity(planck.Vec2(0, 0));
            body.setAngularVelocity(0);
        });
        
        // Disable all joint motors
        Object.values(this.joints).forEach(joint => {
            joint.enableMotor(false);
        });
    }

    destroy() {
        if (this.world) {
            // Clean up physics world
            this.world.clear();
            this.world = null;
        }
        
        this.runnerParts = {};
        this.joints = {};
        
        console.log('Physics Engine destroyed');
    }
}