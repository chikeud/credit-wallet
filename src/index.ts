import express from 'express';
import userRoutes from './api/routes/users';
import walletRoutes from './api/routes/wallet';
import { errorHandler } from './utils/errorHandler';

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);

// git issue 3


app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app; // For testing
