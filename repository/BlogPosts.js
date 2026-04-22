import BlogPost from "../models/BlogPost.js";

export const getBlogPosts = async () => {
  return await BlogPost.find().lean(); // Fetch all blog posts
};

export const getBlogPostById = async (id) => {
  return await BlogPost.findById(id).lean(); // Fetch blog post by ID
};
