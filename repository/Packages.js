import Package from "../models/Packages.js";

export const getPackages = async () => {
  return await Package.find().lean(); // Fetch all packages
};

export const getPackageById = async (id) => {
  return await Package.findById(id).lean(); // Fetch package by ID
};
