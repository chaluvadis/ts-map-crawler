import { initializeDatabase } from './pool';

const init = async () => {
  try {
    await initializeDatabase();
    console.log('Database initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

init();
