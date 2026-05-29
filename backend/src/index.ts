import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import analyzeRouter from './routes/analyze';
import unlockRouter from './routes/unlock';
import historyRouter from './routes/history';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json({ limit: '25mb' })); // large enough for base64 encoded files

// API routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'lexon-backend' });
});

app.use('/api/analyze', analyzeRouter);
app.use('/api/unlock', unlockRouter);
app.use('/api/history', historyRouter);

// Serve frontend static build in production
// __dirname in compiled output is backend/dist/backend/src/
// frontend dist is at backend/../frontend/dist
const frontendDist = path.join(__dirname, '../../../../frontend/dist');
app.use(express.static(frontendDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`LexOn running on port ${PORT}`);
});
