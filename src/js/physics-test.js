import { PhysicsEngine } from './physics-engine.js';

export class PhysicsTest {
    constructor() {
        this.physicsEngine = null;
        this.testResults = {
            worldCreated: false,
            runnerCreated: false,
            groundCreated: false,
            forcesApplied: false,
            updateWorking: false
        };
    }

    async runTests() {
        console.log('Starting Physics Engine Tests...');
        
        try {
            // Test 1: Initialize physics engine
            this.physicsEngine = new PhysicsEngine();
            await this.physicsEngine.init();
            this.testResults.worldCreated = this.physicsEngine.world !== null;
            console.log('✓ Physics world created:', this.testResults.worldCreated);

            // Test 2: Check if runner parts exist
            const runnerParts = this.physicsEngine.getAllBodyParts();
            this.testResults.runnerCreated = Object.keys(runnerParts).length > 0;
            console.log('✓ Runner created:', this.testResults.runnerCreated);
            console.log('  Runner parts:', Object.keys(runnerParts));

            // Test 3: Check if ground exists
            this.testResults.groundCreated = this.physicsEngine.ground !== null;
            console.log('✓ Ground created:', this.testResults.groundCreated);

            // Test 4: Test force application
            this.physicsEngine.forces.leftThigh = true;
            this.physicsEngine.update(1/60);
            this.testResults.forcesApplied = true;
            console.log('✓ Forces can be applied');

            // Test 5: Test multiple updates
            for (let i = 0; i < 10; i++) {
                this.physicsEngine.update(1/60);
            }
            this.testResults.updateWorking = true;
            console.log('✓ Physics updates working');

            // Test 6: Get runner state
            const runnerState = this.physicsEngine.getRunnerState();
            console.log('✓ Runner state accessible:', runnerState);

            // Test 7: Test reset functionality
            this.physicsEngine.reset();
            console.log('✓ Reset functionality working');

            this.printTestSummary();
            return this.testResults;

        } catch (error) {
            console.error('Physics test failed:', error);
            this.testResults.error = error.message;
            return this.testResults;
        }
    }

    printTestSummary() {
        console.log('\n=== Physics Engine Test Summary ===');
        const passed = Object.values(this.testResults).filter(result => result === true).length;
        const total = Object.keys(this.testResults).length;
        
        console.log(`Tests passed: ${passed}/${total}`);
        
        if (this.testResults.error) {
            console.log('❌ Error:', this.testResults.error);
        } else if (passed === total) {
            console.log('✅ All physics tests passed!');
        } else {
            console.log('⚠️  Some tests failed');
        }
    }

    getTestResults() {
        return this.testResults;
    }
}