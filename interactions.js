/**
 * Vercel Serverless Function - Gère les interactions Discord (boutons)
 * Route: POST /api/interactions
 */

import { verifyKey } from 'discord-interactions';

// Stockage temporaire (en mémoire - reset à chaque cold start)
const messageResponses = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { DISCORD_PUBLIC_KEY } = process.env;

  if (!DISCORD_PUBLIC_KEY) {
    return res.status(500).json({ error: 'Missing DISCORD_PUBLIC_KEY' });
  }

  // Vérifier la signature Discord
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const rawBody = JSON.stringify(req.body);

  const isValid = verifyKey(rawBody, signature, timestamp, DISCORD_PUBLIC_KEY);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const interaction = req.body;

  // Ping (vérification Discord)
  if (interaction.type === 1) {
    return res.status(200).json({ type: 1 });
  }

  // Button click
  if (interaction.type === 3) {
    const messageId = interaction.message.id;
    const username = interaction.member?.user?.username || interaction.user?.username || 'Unknown';
    const buttonId = interaction.data.custom_id;

    // Récupérer ou créer le tracking
    let responses = messageResponses.get(messageId);
    if (!responses) {
      responses = { intercept: [], not_available: [] };
      messageResponses.set(messageId, responses);
    }

    // Retirer des autres listes
    responses.intercept = responses.intercept.filter(u => u !== username);
    responses.not_available = responses.not_available.filter(u => u !== username);

    // Ajouter à la liste choisie
    if (buttonId === 'intercept') {
      responses.intercept.push(username);
    } else if (buttonId === 'not_available') {
      responses.not_available.push(username);
    }

    // Mettre à jour l'embed
    const embed = interaction.message.embeds[0];
    if (embed) {
      const coordIndex = embed.fields.findIndex(f => f.name === '📢 Coordination');

      let coordValue = '';
      if (responses.intercept.length > 0) {
        coordValue += `🛡️ **Interceptent:** ${responses.intercept.join(', ')}\n`;
      }
      if (responses.not_available.length > 0) {
        coordValue += `❌ **Pas dispo:** ${responses.not_available.join(', ')}`;
      }
      if (!coordValue) {
        coordValue = '*En attente de réponses...*';
      }

      if (coordIndex !== -1) {
        embed.fields[coordIndex].value = coordValue;
      }
    }

    // Répondre avec le message mis à jour
    return res.status(200).json({
      type: 7,
      data: {
        embeds: [embed],
        components: interaction.message.components
      }
    });
  }

  return res.status(200).json({ type: 1 });
}
