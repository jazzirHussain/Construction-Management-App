import chalk from 'chalk';

const requestLogger = (req, res, next) => {
  const log = (message, statusCode) => {
    switch (req.method) {
      case 'GET':
        console.log(chalk.blue(`${message} ${statusCode}`));
        break;
      case 'POST':
        console.log(chalk.green(`${message} ${statusCode}`));
        break;
      case 'PUT':
        console.log(chalk.yellow(`${message} ${statusCode}`));
        break;
      case 'DELETE':
        console.log(chalk.red(`${message} ${statusCode}`));
        break;
      default:
        console.log(chalk.white(`${message} ${statusCode}`));
    }
  };

  res.on('finish', () => {
    const logMessage = `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`;
    log(logMessage, res.statusCode);
  });

  next();
};

export default requestLogger;
