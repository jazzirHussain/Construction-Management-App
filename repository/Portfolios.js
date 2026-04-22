import Portfolio from "../models/Portfolios.js";

export const getPortfolios = async () => {
  return await Portfolio.find().lean(); // Fetch all portfolios
};

export const getPortfolioById = async (id) => {
  return await Portfolio.findById(id).lean(); // Fetch portfolio by ID
};
