/**
 * Vercel Serverless Function - Envoie un message Discord avec boutons
 * Route: POST /api/send
 */

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { BOT_TOKEN, CHANNEL_ID } = process.env;

  if (!BOT_TOKEN || !CHANNEL_ID) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    const payload = req.body;

    // Ajouter les boutons
    payload.components = [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 3,
            label: "J'intercepte",
            emoji: { name: '🛡️' },
            custom_id: 'intercept'
          },
          {
            type: 2,
            style: 4,
            label: 'Pas dispo',
            emoji: { name: '❌' },
            custom_id: 'not_available'
          }
        ]
      }
    ];

    const response = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ success: false, error: `Discord API: ${response.status}` });
    }

    const message = await response.json();
    return res.status(200).json({ success: true, messageId: message.id });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
