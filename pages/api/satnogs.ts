
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://db.satnogs.org/api/signals/?status=UNIDENTIFIED&format=json');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching SatNOGS data:', error);
    res.status(500).json({ error: 'Error fetching SatNOGS data' });
  }
}
