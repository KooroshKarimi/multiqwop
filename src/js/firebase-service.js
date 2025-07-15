import { firebaseConfig } from './firebase-config.js';

export class FirebaseService {
    constructor() {
        this.db = null;
        this.isInitialized = false;
        this.config = firebaseConfig;
    }

    async init() {
        try {
            // Check if Firebase is available
            if (typeof firebase === 'undefined') {
                console.warn('Firebase not available, using mock mode');
                this.setupMockMode();
                return;
            }

            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(this.config);
            }

            this.db = firebase.firestore();
            this.isInitialized = true;
            
            console.log('Firebase Service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Firebase:', error);
            this.setupMockMode();
        }
    }

    setupMockMode() {
        console.log('Setting up mock Firebase service');
        this.isInitialized = false;
        this.mockData = {
            scores: [
                { name: 'Test Player', email: 'test@example.com', distance: 85.5, timestamp: Date.now() - 86400000 },
                { name: 'Demo User', email: 'demo@example.com', distance: 67.2, timestamp: Date.now() - 172800000 },
                { name: 'QWOP Master', email: 'master@example.com', distance: 45.8, timestamp: Date.now() - 259200000 }
            ]
        };
    }

    async submitScore(scoreData) {
        try {
            if (!this.isInitialized) {
                return this.submitScoreMock(scoreData);
            }

            const { name, email, distance } = scoreData;
            
            // Validate input
            if (!name || !email || typeof distance !== 'number') {
                throw new Error('Invalid score data');
            }

            // Check if score is valid (0-100m)
            if (distance < 0 || distance > 100) {
                throw new Error('Invalid distance value');
            }

            const scoreDoc = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                distance: parseFloat(distance.toFixed(1)),
                timestamp: Date.now()
            };

            // Check if user already has a score
            const existingScore = await this.getScoreByEmail(email);
            
            if (existingScore) {
                // Update existing score if new score is better
                if (distance > existingScore.distance) {
                    await this.db.collection('scores').doc(existingScore.id).update(scoreDoc);
                    console.log('Updated existing score');
                    return { success: true, updated: true, score: scoreDoc };
                } else {
                    console.log('New score not better than existing score');
                    return { success: true, updated: false, score: existingScore };
                }
            } else {
                // Add new score
                const docRef = await this.db.collection('scores').add(scoreDoc);
                console.log('Added new score with ID:', docRef.id);
                return { success: true, updated: true, score: { ...scoreDoc, id: docRef.id } };
            }

        } catch (error) {
            console.error('Error submitting score:', error);
            throw error;
        }
    }

    async getHighscores(limit = 10) {
        try {
            if (!this.isInitialized) {
                return this.getHighscoresMock(limit);
            }

            const snapshot = await this.db
                .collection('scores')
                .orderBy('distance', 'desc')
                .limit(limit)
                .get();

            const scores = [];
            snapshot.forEach(doc => {
                scores.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return scores;

        } catch (error) {
            console.error('Error getting highscores:', error);
            throw error;
        }
    }

    async getScoreByEmail(email) {
        try {
            if (!this.isInitialized) {
                return this.getScoreByEmailMock(email);
            }

            const snapshot = await this.db
                .collection('scores')
                .where('email', '==', email.toLowerCase())
                .limit(1)
                .get();

            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                return {
                    id: doc.id,
                    ...doc.data()
                };
            }

            return null;

        } catch (error) {
            console.error('Error getting score by email:', error);
            return null;
        }
    }

    async getPlayerRank(email) {
        try {
            if (!this.isInitialized) {
                return this.getPlayerRankMock(email);
            }

            const playerScore = await this.getScoreByEmail(email);
            if (!playerScore) {
                return null;
            }

            const snapshot = await this.db
                .collection('scores')
                .where('distance', '>', playerScore.distance)
                .get();

            return snapshot.size + 1;

        } catch (error) {
            console.error('Error getting player rank:', error);
            return null;
        }
    }

    // Mock implementations for when Firebase is not available
    submitScoreMock(scoreData) {
        const { name, email, distance } = scoreData;
        
        // Check if user already has a score
        const existingIndex = this.mockData.scores.findIndex(score => 
            score.email.toLowerCase() === email.toLowerCase()
        );

        const scoreDoc = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            distance: parseFloat(distance.toFixed(1)),
            timestamp: Date.now()
        };

        if (existingIndex !== -1) {
            // Update existing score if new score is better
            if (distance > this.mockData.scores[existingIndex].distance) {
                this.mockData.scores[existingIndex] = scoreDoc;
                console.log('Updated existing score (mock)');
                return { success: true, updated: true, score: scoreDoc };
            } else {
                console.log('New score not better than existing score (mock)');
                return { success: true, updated: false, score: this.mockData.scores[existingIndex] };
            }
        } else {
            // Add new score
            this.mockData.scores.push(scoreDoc);
            console.log('Added new score (mock)');
            return { success: true, updated: true, score: scoreDoc };
        }
    }

    getHighscoresMock(limit = 10) {
        // Sort by distance descending and return top scores
        const sortedScores = [...this.mockData.scores]
            .sort((a, b) => b.distance - a.distance)
            .slice(0, limit);
        
        return sortedScores;
    }

    getScoreByEmailMock(email) {
        return this.mockData.scores.find(score => 
            score.email.toLowerCase() === email.toLowerCase()
        ) || null;
    }

    getPlayerRankMock(email) {
        const playerScore = this.getScoreByEmailMock(email);
        if (!playerScore) {
            return null;
        }

        const betterScores = this.mockData.scores.filter(score => 
            score.distance > playerScore.distance
        );

        return betterScores.length + 1;
    }

    // Utility methods
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateName(name) {
        return name && name.trim().length >= 2 && name.trim().length <= 50;
    }

    sanitizeInput(input) {
        return input.trim().replace(/[<>]/g, '');
    }

    // Get connection status
    isConnected() {
        return this.isInitialized;
    }

    // Get mock data for testing
    getMockData() {
        return this.mockData;
    }

    // Clear mock data
    clearMockData() {
        this.mockData = { scores: [] };
    }
}