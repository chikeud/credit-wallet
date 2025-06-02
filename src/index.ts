
import cors from 'cors';
import express from 'express';
import riskRoutes from './api/routes/risk';
import scoringRoutes from './api/routes/scoring';
import kycRoutes from './api/routes/kyc';
import { errorHandler } from './utils/errorHandler';

const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/risk', riskRoutes);
app.use('/api/scoring', scoringRoutes);
app.use('/api/kyc', kycRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app; // For testing
