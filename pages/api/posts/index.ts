import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '@/lib/dbConnect';
import Post from '@/lib/models/Post';
import slugify from 'slugify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { page = '1', limit = '9', tag, author, search } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const query: any = { published: true };
      if (tag) query.tags = tag as string;
      if (author) query.author = author as string;
      if (search) query.$text = { $search: search as string };

      const [posts, total] = await Promise.all([
        Post.find(query)
          .populate('author', 'name email avatar')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Post.countDocuments(query),
      ]);

      return res.status(200).json({
        posts,
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const { title, content, excerpt, tags, coverImage, published } = req.body;
      if (!title || !content) return res.status(400).json({ message: 'Title and content required' });

      let slug = slugify(title, { lower: true, strict: true });
      const existing = await Post.findOne({ slug });
      if (existing) slug = `${slug}-${Date.now()}`;

      const post = await Post.create({
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200).replace(/[#*`]/g, '') + '...',
        author: (session.user as any).id,
        tags: tags || [],
        coverImage: coverImage || '',
        published: published !== false,
      });

      await post.populate('author', 'name email avatar');
      return res.status(201).json(post);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
