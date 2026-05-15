import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '@/lib/dbConnect';
import Post from '@/lib/models/Post';
import slugify from 'slugify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { slug } = req.query;

  if (req.method === 'GET') {
    try {
      const post = await Post.findOneAndUpdate(
        { slug, published: true },
        { $inc: { views: 1 } },
        { new: true }
      ).populate('author', 'name email avatar bio');

      if (!post) return res.status(404).json({ message: 'Post not found' });
      return res.status(200).json(post);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === 'PUT') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const post = await Post.findOne({ slug });
      if (!post) return res.status(404).json({ message: 'Post not found' });
      if (post.author.toString() !== (session.user as any).id) {
        return res.status(403).json({ message: 'Forbidden: not your post' });
      }

      const { title, content, excerpt, tags, coverImage, published } = req.body;

      if (title && title !== post.title) {
        let newSlug = slugify(title, { lower: true, strict: true });
        const conflict = await Post.findOne({ slug: newSlug, _id: { $ne: post._id } });
        if (conflict) newSlug = `${newSlug}-${Date.now()}`;
        post.slug = newSlug;
      }

      if (title !== undefined) post.title = title;
      if (content !== undefined) post.content = content;
      if (excerpt !== undefined) post.excerpt = excerpt;
      if (tags !== undefined) post.tags = tags;
      if (coverImage !== undefined) post.coverImage = coverImage;
      if (published !== undefined) post.published = published;

      await post.save();
      await post.populate('author', 'name email avatar');
      return res.status(200).json(post);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const post = await Post.findOne({ slug });
      if (!post) return res.status(404).json({ message: 'Post not found' });
      if (post.author.toString() !== (session.user as any).id) {
        return res.status(403).json({ message: 'Forbidden: not your post' });
      }

      await post.deleteOne();
      return res.status(200).json({ message: 'Post deleted' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
