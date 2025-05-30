import cors from 'cors';
import path from 'path';
import express from 'express';
import riskRoutes from './api/routes/risk';
import scoringRoutes from './api/routes/scoring';
import kycRoutes from './api/routes/kyc';
import bodyParser from 'body-parser';
import { errorHandler } from './utils/errorHandler';

const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/risk', riskRoutes);
app.use('/api/scoring', scoringRoutes);
app.use('/api/kyc', kycRoutes);

app.use(errorHandler);

// Serve React Frontend
//app.use(express.static('../client/dist'));
//app.get('*', (_, res) => res.sendFile('index.html', { root: '../client/dist' }));
// Serve static files from frontend build
const clientBuildPath = path.join(__dirname, '../public/client/dist');
//app.use(express.static('../public/client/dist'));

// Catch-all route to serve index.html for SPA routes
//app.get('*', (_, res) => {
  //  res.sendFile('../public/client/dist');
//});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app; // For testing
