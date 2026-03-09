# OGame Attack Notifier - Vercel Serverless

Serverless Discord bot gratuit sur Vercel.

---

## Déploiement

### 1. Créer le Bot Discord

1. Va sur [Discord Developer Portal](https://discord.com/developers/applications)
2. **New Application** → Nomme-le `OGame Notifier`
3. Note la **Public Key** (page General Information)
4. **Bot** → **Reset Token** → Copie le token
5. **OAuth2** → **URL Generator** → Coche `bot`
6. Permissions : `Send Messages`, `Embed Links`
7. Ouvre l'URL pour inviter le bot

### 2. Récupérer le Channel ID

1. Discord → Paramètres → Avancés → **Mode développeur**
2. Clic droit sur le channel → **Copier l'identifiant**

### 3. Déployer sur Vercel

1. Upload ce dossier `server/` sur GitHub
2. Va sur [vercel.com](https://vercel.com) → **Sign up with GitHub**
3. **Import** ton repo
4. Dans **Environment Variables**, ajoute :

| Variable | Valeur |
|----------|--------|
| `BOT_TOKEN` | Ton token Discord |
| `CHANNEL_ID` | L'ID du channel |
| `DISCORD_PUBLIC_KEY` | La clé publique |

5. Clique **Deploy**

### 4. Configurer Discord Interactions

1. Retourne sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Ton app → **General Information**
3. **Interactions Endpoint URL** : `https://ton-app.vercel.app/api/interactions`

### 5. Configurer l'Extension

1. Copie ton URL : `https://ton-app.vercel.app`
2. Colle dans **Serveur Discord** de l'extension
3. Le badge passe en **Online** ✓

---

## Structure

```
server/
├── api/
│   ├── send.js          # POST /api/send (envoie les messages)
│   ├── interactions.js  # POST /api/interactions (boutons)
│   └── status.js        # GET /api/status (health check)
├── package.json
└── README.md
```

---

## Fonctionnement

1. L'extension envoie les alertes à `/api/send`
2. La fonction poste sur Discord avec boutons
3. Les clics appellent `/api/interactions`
4. Le message se met à jour en temps réel
