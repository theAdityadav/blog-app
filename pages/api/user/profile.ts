import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const user = await User.findById((session.user as any).id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, bio } = req.body;
      const user = await User.findByIdAndUpdate(
        (session.user as any).id,
        { name, bio },
        { new: true, runValidators: true }
      ).select('-password');
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
