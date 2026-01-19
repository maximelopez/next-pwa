# 📱 Next PWA — Documentation Complète

## 🚀 Présentation

Next PWA est une **Progressive Web App** construite avec **Next.js**, **TypeScript** et des fonctionnalités modernes :

- Géolocalisation et affichage de la position sur une carte
- Carte interactive
- Affichage du niveau de batterie de l’appareil
- Chat en temps réel avec Socket.IO et rooms
- Support PWA pour installation et offline

### Stack technique

- Next.js (App Router)
- TypeScript
- React
- Leaflet pour la cartographie
- Socket.IO client pour le chat

---

## 📦 Installation

1. Cloner le projet :

```bash
git clone https://github.com/maximelopez/next-pwa.git
cd next-pwa
```

2. Installer les dépendances :

```bash
npm install
```

3. Démarrer le serveur de développement :

```bash
npm run dev
```

4. Ouvrir l’application dans le navigateur :

```
http://localhost:3000
```

---

## ⚙️ Scripts disponibles

| Commande         | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`    | Démarrage en mode développement      |
| `npm run build`  | Build pour production                |
| `npm run start`  | Lancer l’application buildée         |

---

## 🧩 Composants clés

### 1. BatteryStatus

- Affiche le **niveau de batterie** avec mise à jour automatique

---

### 2. MapLocationClassic

- Affiche la **position actuelle** sur une carte Leaflet
- Props :
  - `width?: string | number`
  - `height?: string | number`
  - `zoom?: number`
- Marqueur et popup indiquant “Vous êtes ici”
- Chargement côté client uniquement (`dynamic import ssr: false`)

---

### 3. Room (Chat)

- Composant principal pour le **chat en temps réel**
- Fonctionnalités :
  - Connexion/déconnexion d’un utilisateur
  - Gestion pseudo + photo
  - Liste des rooms disponibles
  - Rejoindre / quitter une room
  - Envoyer / recevoir des messages
- Événements Socket.IO utilisés :
  - `connect`, `disconnect`
  - `chat-msg` (réception des messages)
  - `chat-joined-room` (rejoindre une room)
  - `chat-leave-room` (quitter une room)
  - `error` (erreurs serveur)

---

## 🌐 Fonctionnalités de l’application

1. **Géolocalisation**
   - Récupère latitude/longitude
   - Affiche ville ou position sur carte

2. **Cartographie**
   - Leaflet avec styles clair / dark
   - Marqueur sur la position
   - Popup “Vous êtes ici”

3. **Niveau de batterie**
   - Affiche pourcentage de batterie
   - Mise à jour dynamique

4. **Chat en temps réel**
   - Rooms multiples
   - Messages envoyés/recus
   - Gestion du pseudo et avatar

5. **PWA**
   - Installation possible sur mobile
   - Offline support via Service Worker
   - Manifest JSON pour icônes et thème

---


## 🚀 Déploiement

- Déployable sur VPS
- HTTPS requis pour PWA et géolocalisation
- Optimisé pour mobile et desktop

---

## 📚 Ressources utiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [Next PWA GitHub](https://github.com/shadowwalker/next-pwa)
