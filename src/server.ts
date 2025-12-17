import app from './app';
import config from './config/config';
import logger from './utils/logger';

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║  Express Auth0 User Management API                        ║
    ║                                                           ║
    ║  Server is running on port ${PORT}                           ║
    ║  Environment: ${config.nodeEnv}                              ║
    ║                                                           ║
    ║  API Documentation: http://localhost:${PORT}/api-docs        ║
    ║  Health Check: http://localhost:${PORT}/api/health           ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use`);
  } else {
    logger.error('Server error:', error);
  }
  process.exit(1);
});

export default server;
