import app from './app';
import config from './config/env';

const PORT = config.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
