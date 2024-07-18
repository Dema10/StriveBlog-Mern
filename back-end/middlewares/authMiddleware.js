import { verifyJWT } from "../utils/jwt.js";
import Author from "../models/author.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer", "");

        if(!token) {
            return res.status(401).send("Token mancante");
        }

        const decoded = await verifyJWT(token);

        const author = await Author.findById(decoded.id).select("-password");

        if(!author) {
            return res.status(401).send("Autore non trovato");
        }

        req.author = author;

        next();

    } catch (err) {
        res.status(401).send("Token non valido");
    }
}