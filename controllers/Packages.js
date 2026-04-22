import * as packageRepository from '../repository/Packages.js';

export const listPackages = async (req, res) => {
  try {
    const packages = await packageRepository.getPackages();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packages', error });
  }
};

export const getPackage = async (req, res) => {
  try {
    const package_data = await packageRepository.getPackageById(req.params.id);
    if (!package_data) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(package_data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching package', error });
  }
};