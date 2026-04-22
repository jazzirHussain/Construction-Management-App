import * as blogPostRepository from '../repository/BlogPosts.js';

export const listBlogPosts = async (req, res) => {
  try {
    const blogPosts = await blogPostRepository.getBlogPosts();
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog posts', error });
  }
};

export const getBlogPost = async (req, res) => {
  try {
    const blogPost = await blogPostRepository.getBlogPostById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post', error });
  }
};
