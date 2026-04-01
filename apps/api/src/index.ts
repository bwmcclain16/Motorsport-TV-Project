import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/index.js';
import './db/database.js';

const port = Number(process.env.PORT ?? 4100);
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Motorsport TV API running on http://localhost:${port}`);
});
