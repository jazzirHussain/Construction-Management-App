import express from 'express';
import * as packageController from '../controllers/Packages.js';
import * as blogPostController from '../controllers/BlogPost.js';
import * as portfolioController from '../controllers/Portfolios.js';

const router = express.Router();

// Package Routes
router.get('/packages', packageController.listPackages);
router.get('/packages/:id', packageController.getPackage);

// Blog Post Routes
router.get('/blog-posts', blogPostController.listBlogPosts);
router.get('/blog-posts/:id', blogPostController.getBlogPost);

// Portfolio Routes
router.get('/portfolios', portfolioController.listPortfolios);
router.get('/portfolios/:id', portfolioController.getPortfolio);

export default router;
