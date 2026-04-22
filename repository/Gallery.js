import Gallery from '../models/Gallery.js';
import mongoose from 'mongoose';

class GalleryRepository {
  
  // Add new gallery for a project
  static async addGallery(galleryData) {
    try {      
      const { project } = galleryData
      // Ensure the project is unique in the Gallery collection
      const existingGallery = await Gallery.findOne({ project: project });
      if (existingGallery) {
        throw new Error('Gallery for this project already exists.');
      }

      const gallery = new Gallery(galleryData);
      await gallery.save();

      return gallery;
    } catch (error) {
      throw new Error(`Error adding gallery: ${error.message}`);
    }
  }

  // Delete gallery by project ID
  static async deleteGallery(projectId) {
    try {
      const deletedGallery = await Gallery.findOneAndDelete({ project: projectId });
      return deletedGallery;
    } catch (error) {
      throw new Error(`Error deleting gallery: ${error.message}`);
    }
  }

  // Get gallery by project ID, sort images by date
  static async getGalleryByProject(projectId) {
    try {
      const gallery = await Gallery.findOne({ project: projectId }).sort({ 'images.date': 1 });
      if (!gallery) {
        throw new Error('Gallery not found for the given project.');
      }
      return gallery;
    } catch (error) {
      throw new Error(`Error fetching gallery: ${error.message}`);
    }
  }

  // Update gallery for a given project
  static async updateGallery(projectId, updateDate) {
    try {
      const gallery = await Gallery.findOne({ project: projectId });
      if (!gallery) {
        throw new Error('Gallery not found for the given project.');
      }

      await Gallery.findOneAndUpdate({project: projectId}, updateDate)
      return gallery;
    } catch (error) {
      throw new Error(`Error updating gallery: ${error.message}`);
    }
  }

  // Update gallery images for a given project
  static async addImages(projectId, newImages) {
    try {
      const gallery = await Gallery.findOne({ project: projectId });
      if (!gallery) {
        throw new Error('Gallery not found for the given project.');
      }

      gallery.images.push(...newImages); // Append new images
      await gallery.save();

      return gallery;
    } catch (error) {
      throw new Error(`Error updating gallery: ${error.message}`);
    }
  }
}

export default GalleryRepository;
