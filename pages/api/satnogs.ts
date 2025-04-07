// pages/api/satnogs.ts

export default async function handler(req, res) {
  try {
    const response = await fetch('https://db.satnogs.org/api/signals/?status=UNIDENTIFIED&format=json');

    if (!response.ok) {
      return res.status(response.status).json({ error: 'SatNOGS API failed' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Server error fetching SatNOGS data' });
  }
}
