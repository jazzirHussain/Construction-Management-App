import * as portfolioRepository from '../repository/Portfolios.js';

export const listPortfolios = async (req, res) => {
  try {
    const portfolios = await portfolioRepository.getPortfolios();
    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolios', error });
  }
};

export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await portfolioRepository.getPortfolioById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio', error });
  }
};
