/**
 * Loading.js - Écran de chargement, menu et progression
 * Gère l'affichage du chargement et la transition vers la scène
 */

const Loading = {
    // Éléments DOM
    loadingScreen: null,
    progressBar: null,
    loadingText: null,
    loadingProgress: null,
    startMenu: null,
    startButton: null,

    // État
    progress: 0,
    isLoading: true,
    isLoaded: false,
    assetsToLoad: [],
    assetsLoaded: 0,

    /**
     * Initialise le module de chargement
     */
    init: function() {
        console.log('[Loading] Initialisation...');
        
        // Attendre que le DOM soit complètement chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupElements();
            });
        } else {
            this.setupElements();
        }

        // Écouter le chargement de la scène A-Frame
        this.setupSceneLoadListener();
    },

    /**
     * Configure les éléments DOM une fois le DOM prêt
     */
    setupElements: function() {
        console.log('[Loading] Configuration des éléments DOM...');
        
        this.loadingScreen = document.querySelector('#loading-screen');
        this.progressBar = document.querySelector('#progress-bar');
        this.loadingText = document.querySelector('#loading-text');
        this.loadingProgress = document.querySelector('#loading-progress');
        this.startMenu = document.querySelector('#start-menu');
        this.startButton = document.querySelector('#start-button');

        console.log('[Loading] Éléments trouvés:', {
            loadingScreen: !!this.loadingScreen,
            progressBar: !!this.progressBar,
            loadingText: !!this.loadingText,
            loadingProgress: !!this.loadingProgress,
            startMenu: !!this.startMenu,
            startButton: !!this.startButton
        });

        // Écouter le bouton de démarrage
        if (this.startButton) {
            this.startButton.addEventListener('click', () => {
                this.startGame();
            });
        }
    },

    /**
     * Configure l'écouteur de chargement de la scène
     */
    setupSceneLoadListener: function() {
        const scene = document.querySelector('a-scene');
        
        if (scene.hasLoaded) {
            this.onSceneLoaded();
        } else {
            scene.addEventListener('loaded', () => this.onSceneLoaded());
        }

        // Écouter le chargement des assets
        const assets = document.querySelector('#game-assets');
        if (assets) {
            assets.addEventListener('loaded', () => {
                console.log('[Loading] Assets chargés');
                this.updateProgress(100);
            });
        }
    },

    /**
     * Appelé quand la scène est chargée
     */
    onSceneLoaded: function() {
        console.log('[Loading] Scène chargée');
        this.simulateLoading();
    },

    /**
     * Simule une progression de chargement fluide
     */
    simulateLoading: function() {
        let progress = 0;
        
        const interval = setInterval(() => {
            if (progress >= 100) {
                clearInterval(interval);
                this.onLoadingComplete();
                return;
            }

            // Progression plus rapide au début, plus lente à la fin
            const increment = progress < 70 ? 3 : progress < 90 ? 2 : 1;
            progress = Math.min(100, progress + increment);
            this.updateProgress(progress);
        }, 30);
    },

    /**
     * Met à jour la barre de progression
     * @param {number} percent - Pourcentage (0-100)
     */
    updateProgress: function(percent) {
        this.progress = percent;
        
        if (this.progressBar) {
            this.progressBar.style.width = percent + '%';
        }

        if (this.loadingText) {
            if (percent < 30) {
                this.loadingText.textContent = 'Chargement des ressources...';
            } else if (percent < 60) {
                this.loadingText.textContent = 'Préparation du débarras...';
            } else if (percent < 90) {
                this.loadingText.textContent = 'Réveil des monstres...';
            } else {
                this.loadingText.textContent = 'Presque prêt !';
            }
        }
    },

    /**
     * Appelé quand le chargement est terminé
     */
    onLoadingComplete: function() {
        console.log('[Loading] Chargement terminé');
        this.isLoading = false;

        // Transition fluide
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 500);
    },

    /**
     * Cache l'écran de chargement
     */
    hideLoadingScreen: function() {
        if (this.loadingScreen) {
            // Fade out
            this.loadingScreen.style.transition = 'opacity 0.5s ease';
            this.loadingScreen.style.opacity = '0';

            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                
                // Afficher la scène A-Frame
                const scene = document.querySelector('a-scene');
                if (scene) {
                    scene.style.display = 'block';
                }

                // Émettre l'événement de fin de chargement
                this.emit('loading:complete');
            }, 500);
        }
    },

    /**
     * Affiche l'écran de chargement (pour recharger)
     */
    showLoadingScreen: function() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex';
            this.loadingScreen.style.opacity = '1';
            this.isLoading = true;
            this.updateProgress(0);
        }
    },

    /**
     * Précharge une liste de ressources
     * @param {Array} assets - Liste des URLs à précharger
     * @returns {Promise}
     */
    preloadAssets: async function(assets) {
        this.assetsToLoad = assets;
        this.assetsLoaded = 0;

        const promises = assets.map((asset, index) => {
            return this.loadAsset(asset).then(() => {
                this.assetsLoaded++;
                const percent = Math.floor((this.assetsLoaded / this.assetsToLoad.length) * 100);
                this.updateProgress(percent);
            });
        });

        await Promise.all(promises);
    },

    /**
     * Charge une ressource individuelle
     * @param {string} url - URL de la ressource
     * @returns {Promise}
     */
    loadAsset: function(url) {
        return new Promise((resolve, reject) => {
            if (url.endsWith('.glb') || url.endsWith('.gltf')) {
                // Modèle 3D
                const loader = new THREE.GLTFLoader();
                loader.load(url, resolve, undefined, reject);
            } else if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')) {
                // Image
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
            } else if (url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.ogg')) {
                // Audio
                const audio = new Audio();
                audio.oncanplaythrough = resolve;
                audio.onerror = reject;
                audio.src = url;
            } else {
                // Autre - fetch
                fetch(url).then(resolve).catch(reject);
            }
        });
    },

    /**
     * Émet un événement personnalisé
     * @param {string} eventName - Nom de l'événement
     * @param {object} detail - Détails
     */
    emit: function(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
};

export { Loading };
