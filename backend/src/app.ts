import express from 'express';
import pdfRoutes from './config/routes';
import './config/bdd'
import cors from 'cors'; 

const app = express();

app.use(cors()); // Middleware CORS

app.use(express.json()); // Middleware pour parser le corps des requêtes en JSON
app.use('/api', pdfRoutes);

export default app;
