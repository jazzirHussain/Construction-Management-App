import { GALLERY_FOLDER } from '../constants.js';
import GalleryRepository from '../repository/Gallery.js';
import { getImageFormat, uploadFile, uploadFiles } from '../utils/AWS/Upload.js';

class GalleryController {

  // Add gallery
  static async addGallery(req, res) {
    const galleryData = req.body;
    try {
      if (galleryData?.images) {
        galleryData.images = await uploadGalleryImages(galleryData.images, galleryData.project) || []
      }
      const gallery = await GalleryRepository.addGallery(galleryData);
      return res.status(201).json({ message: 'Gallery added successfully', gallery });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Delete gallery by project ID
  static async deleteGallery(req, res) {
    const { projectId } = req.params;
    try {
      const deletedGallery = await GalleryRepository.deleteGallery(projectId);
      return res.status(200).json({ message: 'Gallery deleted successfully', deletedGallery });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Get gallery by project ID
  static async getGalleryByProject(req, res) {
    const { projectId } = req.params;
    try {
      const gallery = await GalleryRepository.getGalleryByProject(projectId);
      return res.status(200).json({ gallery });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  // Update gallery
  static async updateGallery(req, res) {
    const { projectId } = req.params
    const updateData = req.body;
    try {
      if (updateData?.images) {
        updateData.images = await uploadGalleryImages(updateData.images, projectId) || []
      }
      const updatedGallery = await GalleryRepository.updateGallery(projectId, updateData);
      return res.status(200).json({ message: 'Gallery updated successfully', updatedGallery });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Add images
  static async addImages(req, res) {
    const { projectId } = req.params
    let { images } = req.body;
    try {
      images = await uploadGalleryImages(images, projectId)
      const updatedGallery = await GalleryRepository.addImages(projectId, images);
      return res.status(200).json({ message: 'Images added to Gallery successfully', updatedGallery });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

const uploadGalleryImages = async (images, projectId) => {
  return Promise.all(images.map(async (image) => {
    const imageFormat = getImageFormat(image.url); // Avoid redundant calls
    return {
      url: await uploadFile(
        image.url,
        process.env.BUCKET_NAME,
        `${GALLERY_FOLDER}/${projectId}/${new Date(image.date)?.toISOString() || Date.now()}.${imageFormat}`, // Use imageFormat here
        imageFormat // Pass the format as a parameter
      ),
      date: image.date || Date.now()
    };
  }));
};
export default GalleryController;
