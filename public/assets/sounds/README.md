# 🔊 Sons du jeu Feed The Beasts

Ce dossier contient tous les fichiers audio utilisés dans le jeu.

## 📋 Liste des sons nécessaires

### Effets sonores (SFX)

1. **correct.mp3** - Son joué quand le joueur sélectionne le **bon objet**
   - Type : Son de succès, "ding", "bip positif"
   - Durée recommandée : 0.5-1s
   - Exemple : Son de validation, clochette courte

2. **wrong.mp3** - Son joué quand le joueur sélectionne le **mauvais objet**
   - Type : Son d'erreur, "buzzer", "bip négatif"
   - Durée recommandée : 0.5-1s
   - Exemple : Buzzer d'erreur, "beep" grave

3. **ding.mp3** - Son joué quand une **commande est complétée**
   - Type : Clochette de comptoir, sonnette de service
   - Durée recommandée : 1-2s
   - Exemple : "Ding ding!" de restaurant

4. **click.mp3** - Son joué lors du **clic sur un objet**
   - Type : Son de clic léger
   - Durée recommandée : 0.1-0.3s
   - Exemple : Clic de souris, tap

5. **bonus.mp3** - Son joué quand le joueur **attrape un bonus**
   - Type : Son magique, positif, pétillant
   - Durée recommandée : 1-2s
   - Exemple : Son de power-up, étoiles qui brillent

6. **happening.mp3** - Son joué lors d'un **événement (happening)**
   - Type : Son mystérieux, ambiance changeante
   - Durée recommandée : 2-3s
   - Exemple : Son de transition, effet spécial

### Musiques (loopées)

7. **menu-music.mp3** - Musique du **menu principal**
   - Type : Musique d'ambiance calme
   - Durée recommandée : 30s-1min (en boucle)
   - Style : Accueillante, légère

8. **game-music.mp3** - Musique pendant le **jeu**
   - Type : Musique dynamique, rythmée
   - Durée recommandée : 1-2min (en boucle)
   - Style : Énergique, fun, un peu stressante

## 🎵 Où trouver ces sons ?

### Sites gratuits de sons libres de droits :
- **Freesound.org** - Grande bibliothèque de sons gratuits
- **Pixabay** - Sons et musiques libres de droits
- **Mixkit.co** - Sons et musiques gratuites
- **Zapsplat.com** - Effets sonores gratuits (compte gratuit requis)
- **OpenGameArt.org** - Ressources pour jeux vidéo

### Générateurs de sons :
- **Bfxr.net** - Générateur de sons 8-bit/retro
- **ChipTone** - Créateur de sons de jeu rétro

## 📝 Format des fichiers

- **Format recommandé** : MP3 ou OGG
- **Taux d'échantillonnage** : 44.1 kHz
- **Bitrate** : 128-192 kbps (pour garder des fichiers légers)

## 🔧 Implémentation actuelle

Le système de sons est déjà intégré dans le jeu :
- ✅ `correct.mp3` - Joué quand un bon objet est sélectionné
- ✅ `wrong.mp3` - Joué quand un mauvais objet est sélectionné
- ✅ `ding.mp3` - Joué quand une commande est complétée
- ✅ `bonus.mp3` - Joué lors de la collecte d'un bonus
- ✅ `gameMusic.mp3` - Musique de fond pendant le jeu

## 🎮 Test des sons

Pour tester les sons dans le jeu, ouvrez la console du navigateur et utilisez :

```javascript
// Tester un son spécifique
window.FeedTheBeasts.soundManager.playSound('correct');
window.FeedTheBeasts.soundManager.playSound('wrong');
window.FeedTheBeasts.soundManager.playSound('ding');

// Ajuster le volume
window.FeedTheBeasts.soundManager.setSFXVolume(0.5); // 50%
window.FeedTheBeasts.soundManager.setMusicVolume(0.3); // 30%

// Couper le son
window.FeedTheBeasts.soundManager.toggleMute();
```
