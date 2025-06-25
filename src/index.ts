import express from 'express';
import cors from 'cors';
import riskRoutes from './api/routes/risk_route';
import scoringRoutes from './api/routes/scoring_route';
import creditScoreRoutes from './api/routes/smartScore_route'
import kycRoutes from './api/routes/kyc_route';
import pfmRoutes from "./api/routes/pfm_routes";
import { errorHandler } from './utils/errorHandler';

const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/risk', riskRoutes);
app.use('/api/scoring', scoringRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/cc', creditScoreRoutes);
app.use('/api/pfm', pfmRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app; // For testing
