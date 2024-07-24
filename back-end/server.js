import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import authorRoutes from './routes/authorRoutes.js';
import blogPostRoutes from './routes/blogPostRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { badRequestHandler, authorizedHandler, notFoundHandler, genericErrorHandler } from './middlewares/errorHandlers.js';
import path from 'path';
import { fileURLToPath } from 'url';
import session from "express-session";
import passport from "./config/passportConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

const corsOptions = {
    origin: function (origin, callback) {
        const whitelist = [
            'http://localhost:5173', // LOCALE
            'https://striveblog-mern.onrender.com', // VERCEL
        ]

        if (process.env.NODE_ENV === 'development') {
            callback(null, true)
        } else if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('GENERIC CORS ERROR - CORS (SERVER BACKEND)'))
        }
    },
    credentials: true
}

app.use(cors(corsOptions));

app.use(express.json());

// Configurazione sessione per autenticazione Google
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Inizializzazione passport
app.use(passport.initialize());
app.use(passport.session());

//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MONGODB CONNESSO CORRETTAMENTE'))
    .catch((err) => console.error('ERRORE', err))

app.use('/auth', authRoutes)
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