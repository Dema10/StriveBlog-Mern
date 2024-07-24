import express from "express";
import Author from "../models/author.js";
import { generateJWT } from "../utils/jwt.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import passport from "../config/passportConfig.js";

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const router = express.Router();

// POST /login per restituire il token per l'accesso
router.post("/login", async (req, res) =>{
    try {
        const { email, password } = req.body;

        // cerco l'autore nel db grazie alla mail
        const author = await Author.findOne({ email });
        console.log(author);
        if (!author) {
            return res.status(401).json({ message: "Email non valida" });
        }

        // verifico la password
        const pass = await author.comparePassword(password)
        if (!pass) {
            return res.status(401).json({ message: "Password non valida" });
        }

        // se tutto corretto genero il token
        const token = await generateJWT({ id: author._id });
        console.log(token);

        res.json({ token, message: "Login effetuato con successo" });
    } catch (err) {
        console.error("Errore nella login:", err);
        res.status(500).json({ message: "Errore del server" });  
    }
});

// GET /me rotta che restituisce l'autore loggato
router.get("/me", authMiddleware, (req, res) => {
    const authorData = req.author.toObject();
    // elimino la password sempre per sicurezza
    delete authorData.password;
    res.json(authorData);
});

// ROTTE AUTENTICAZIONE GOOGLE
// rotta per iniziare il processo di autenticazione
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rotta di callback per l'autenticazione Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }), async (req, res) => {
    try {
        const token = await generateJWT({ id: req.user._id });
        res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    } catch (error) {
        console.error('Errore nella generazione del token:', error);
        res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
});

export default router;