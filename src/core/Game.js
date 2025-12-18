/**
 * Game.js - Gestionnaire principal du jeu Feed The Beasts
 * Gère l'état du jeu, le timer, le score, et la logique de jeu
 */

const Game = {
    // État du jeu
    state: {
        isRunning: false,
        isPaused: false,
        difficulty: 'normal', // 'easy', 'normal', 'hard'
        score: 0,
        timeRemaining: 120, // secondes
        monstersServed: 0,
        currentOrder: [],
        collectedItems: []
    },

    // Configuration par difficulté
    config: {
        easy: {
            duration: 180,      // 3 minutes
            orderSize: 1,       // 1 objet par commande
            happeningInterval: 90, // événement toutes les 90s
            bonusSpawnRate: 0.3
        },
        normal: {
            duration: 120,      // 2 minutes
            orderSize: 2,       // 2 objets par commande
            happeningInterval: 60,
            bonusSpawnRate: 0.2
        },
        hard: {
            duration: 90,       // 1.5 minutes
            orderSize: 3,       // 3 objets par commande
            happeningInterval: 45,
            bonusSpawnRate: 0.1
        }
    },

    // Timer
    timerInterval: null,

    /**
     * Initialise le jeu
     */
    init: function() {
        console.log('[Game] Initialisation...');
        this.setupEventListeners();
        this.resetState();

        // Démarrage automatique pour les tests
        setTimeout(() => {
            console.log('[Game] Démarrage automatique pour les tests...');
            this.startGame();
        }, 1000);
    },

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners: function() {
        // Boutons de menu
        const btnStart = document.querySelector('#btn-start');
        const btnEasy = document.querySelector('#btn-easy');
        const btnMedium = document.querySelector('#btn-medium');
        const btnHard = document.querySelector('#btn-hard');

        if (btnStart) {
            btnStart.addEventListener('click', () => this.startGame());
        }

        if (btnEasy) {
            btnEasy.addEventListener('click', () => this.setDifficulty('easy'));
        }
        if (btnMedium) {
            btnMedium.addEventListener('click', () => this.setDifficulty('normal'));
        }
        if (btnHard) {
            btnHard.addEventListener('click', () => this.setDifficulty('hard'));
        }
    },

    /**
     * Réinitialise l'état du jeu
     */
    resetState: function() {
        this.state = {
            isRunning: false,
            isPaused: false,
            difficulty: this.state.difficulty || 'normal',
            score: 0,
            timeRemaining: this.config[this.state.difficulty || 'normal'].duration,
            monstersServed: 0,
            currentOrder: [],
            collectedItems: []
        };
        this.updateUI();
    },

    /**
     * Définit la difficulté
     * @param {string} difficulty - 'easy', 'normal', 'hard'
     */
    setDifficulty: function(difficulty) {
        console.log('[Game] Difficulté:', difficulty);
        this.state.difficulty = difficulty;
        this.state.timeRemaining = this.config[difficulty].duration;
        this.updateUI();
        
        // Visual feedback
        document.querySelectorAll('#difficulty-buttons a-box').forEach(btn => {
            btn.setAttribute('scale', '1 1 1');
        });
        const selectedBtn = document.querySelector(`#btn-${difficulty === 'normal' ? 'medium' : difficulty}`);
        if (selectedBtn) {
            selectedBtn.setAttribute('scale', '1.1 1.1 1.1');
        }
    },

    /**
     * Démarre le jeu
     */
    startGame: function() {
        console.log('[Game] Démarrage de la partie');
        
        this.resetState();
        this.state.isRunning = true;
        this.state.timeRemaining = this.config[this.state.difficulty].duration;

        // Cacher le menu
        const menuContainer = document.querySelector('#menu-container');
        if (menuContainer) {
            menuContainer.setAttribute('visible', 'false');
        }

        // Afficher le monde de jeu
        const gameWorld = document.querySelector('#game-world');
        if (gameWorld) {
            gameWorld.setAttribute('visible', 'true');
        }

        // Démarrer le timer
        this.startTimer();

        // Générer le premier monstre et sa commande
        this.emit('game:start', { difficulty: this.state.difficulty });
        
        // Déclencher la première commande
        this.newOrder();
    },

    /**
     * Démarre le timer
     */
    startTimer: function() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            if (!this.state.isPaused && this.state.isRunning) {
                this.state.timeRemaining--;
                this.updateUI();

                if (this.state.timeRemaining <= 0) {
                    this.endGame();
                }

                // Vérifier les happenings
                const happeningInterval = this.config[this.state.difficulty].happeningInterval;
                const elapsed = this.config[this.state.difficulty].duration - this.state.timeRemaining;
                if (elapsed > 0 && elapsed % happeningInterval === 0) {
                    this.emit('game:happening');
                }
            }
        }, 1000);
    },

    /**
     * Génère une nouvelle commande
     */
    newOrder: function() {
        const orderSize = this.config[this.state.difficulty].orderSize;
        this.state.currentOrder = [];
        this.state.collectedItems = [];

        // L'événement sera écouté par le composant Monster
        this.emit('game:newOrder', { 
            size: orderSize,
            difficulty: this.state.difficulty 
        });
    },

    /**
     * Vérifie si un objet cliqué est dans la commande
     * @param {string} objectId - ID de l'objet cliqué
     */
    checkObject: function(objectId) {
        if (!this.state.isRunning) return;

        const orderIndex = this.state.currentOrder.indexOf(objectId);
        
        if (orderIndex !== -1) {
            // Bon objet !
            this.state.collectedItems.push(objectId);
            this.emit('game:correctObject', { objectId });

            // Vérifier si la commande est complète
            if (this.state.collectedItems.length === this.state.currentOrder.length) {
                this.orderComplete();
            }
        } else {
            // Mauvais objet
            this.emit('game:wrongObject', { objectId });
        }
    },

    /**
     * Commande complétée
     */
    orderComplete: function() {
        this.state.monstersServed++;
        
        // Calcul du score (plus rapide = plus de points)
        const baseScore = 100 * this.state.currentOrder.length;
        const timeBonus = Math.floor(this.state.timeRemaining / 10);
        const difficultyMultiplier = {
            easy: 1,
            normal: 1.5,
            hard: 2
        };
        
        const earned = Math.floor(baseScore * difficultyMultiplier[this.state.difficulty]) + timeBonus;
        this.state.score += earned;

        console.log('[Game] Commande complétée! +$' + earned);

        this.emit('game:orderComplete', { 
            earned,
            totalScore: this.state.score,
            monstersServed: this.state.monstersServed 
        });

        this.updateUI();

        // Prochaine commande après un délai
        setTimeout(() => {
            if (this.state.isRunning) {
                this.newOrder();
            }
        }, 1500);
    },

    /**
     * Fin du jeu
     */
    endGame: function() {
        console.log('[Game] Fin de partie! Score final: $' + this.state.score);
        
        this.state.isRunning = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        this.emit('game:end', {
            score: this.state.score,
            monstersServed: this.state.monstersServed,
            difficulty: this.state.difficulty
        });

        // Afficher l'écran de fin
        this.showEndScreen();
    },

    /**
     * Affiche l'écran de fin
     */
    showEndScreen: function() {
        const menuContainer = document.querySelector('#menu-container');
        if (menuContainer) {
            menuContainer.setAttribute('visible', 'true');
            
            // Mettre à jour le texte du menu avec le score
            const menuText = menuContainer.querySelector('a-text[value*="Nourris"]');
            if (menuText) {
                menuText.setAttribute('value', 
                    `Score final: $${this.state.score}\nMonstres servis: ${this.state.monstersServed}`
                );
            }
        }
    },

    /**
     * Active un bonus
     * @param {string} bonusType - Type de bonus
     */
    activateBonus: function(bonusType) {
        console.log('[Game] Bonus activé:', bonusType);
        this.emit('game:bonus', { type: bonusType });
    },

    /**
     * Met en pause le jeu
     */
    pause: function() {
        this.state.isPaused = true;
        this.emit('game:pause');
    },

    /**
     * Reprend le jeu
     */
    resume: function() {
        this.state.isPaused = false;
        this.emit('game:resume');
    },

    /**
     * Met à jour l'interface utilisateur
     */
    updateUI: function() {
        // Timer
        const timerText = document.querySelector('#timer-text');
        if (timerText) {
            const minutes = Math.floor(this.state.timeRemaining / 60);
            const seconds = this.state.timeRemaining % 60;
            timerText.setAttribute('value', `${minutes}:${seconds.toString().padStart(2, '0')}`);
        }

        // Score
        const scoreText = document.querySelector('#score-text');
        if (scoreText) {
            scoreText.setAttribute('value', `$${this.state.score}`);
        }
    },

    /**
     * Émet un événement personnalisé
     * @param {string} eventName - Nom de l'événement
     * @param {object} detail - Détails de l'événement
     */
    emit: function(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    },

    /**
     * Écoute un événement personnalisé
     * @param {string} eventName - Nom de l'événement
     * @param {function} callback - Fonction callback
     */
    on: function(eventName, callback) {
        document.addEventListener(eventName, callback);
    }
};

export { Game };
