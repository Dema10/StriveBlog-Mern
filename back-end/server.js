import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import authorRoutes from './routes/authorRoutes.js';
import blogPostRoutes from './routes/blogPostRoutes.js';
import { badRequestHandler, authorizedHandler, notFoundHandler, genericErrorHandler } from './middlewares/errorHandlers.js';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MONGODB CONNESSO CORRETTAMENTE'))
    .catch((err) => console.error('ERRORE', err))

app.use('/authors', authorRoutes)
app.use('/blogPost', blogPostRoutes)

const PORT = process.env.PORT || 5000;

app.use(badRequestHandler);
app.use(authorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

app.listen(PORT, () => {
    console.log('SIAMO IN ASCOLTO SULLA PORTA ' + PORT)
    console.table(listEndpoints(app));
});