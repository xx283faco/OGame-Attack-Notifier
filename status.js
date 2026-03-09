/**
 * Vercel Serverless Function - Status check
 * Route: GET /api/status
 */

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.status(200).json({
    status: 'ok',
    version: '1.0.0'
  });
}
