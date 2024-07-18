import express from 'express';
import Author from '../models/author.js';
import BlogPost from '../models/blogPost.js';
import cloudinaryUploader from '../config/cloudinaryConfig.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const {page = 1, limit = 10} = req.query
        const authors = await Author.find()
            .limit(limit)
            .skip((page - 1) * limit)

        const count = await Author.countDocuments();

        res.json({
            authors,
            currentPage: page,
            totalPages: Math.ceil(count / limit)
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Autore non trovato' });
        } else {
            res.json(author);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST senza cloudinary
/* router.post('/', async (req, res) => {
    const author = new Author(req.body);

    try {
        const newAuthor = await author.save();
        res.status(201).json(newAuthor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}); */

// POST con cloudinary
router.post('/', cloudinaryUploader.single("avatar"), async (req, res) => {
    try {
        const authorData = req.body;

        if (req.file) {
            authorData.avatar = req.file.path;
        }

        const author = new Author(authorData);
        const newAuthor = await author.save();

        //Rimuovo la password per sicurezza
        const authorRes = newAuthor.toObject();
        delete authorRes.password;

        res.status(201).json(authorRes);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH senza cloudinary
/* router.patch('/:id', async (req, res) => {
    try {
        const updateAuthor = await Author.findByIdAndUpdate (
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updateAuthor) {
            return res.status(404).json({ message: "Autore non trovato" })
        } else {
            res.json({ message: "Autore modificato" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}); */

// PATCH con cloudinary
router.patch('/:id', cloudinaryUploader.single("avatar"), async (req, res) => {
    try {
        const authorData = req.body;

        const oldAuthor = await Author.findById(req.params.id);

        if (!oldAuthor) {
            return res.status(404).json({ message: "Autore non trovato" });
        }

        // Qui gestisco l'aggiornamento dell' avatar
        if (req.file) {
            // Se c'è un nuovo avatar, devo eliminare quello vecchio
            if (oldAuthor.avatar) {
                // Estraggo l'ID pubblico del vecchio avatar
                const publicId = `blog_covers/${oldAuthor.avatar.split('/').pop().split('.')[0]}`;
                console.log("Extracted publicId:", publicId);
                try {
                    // Provo a eliminare il vecchio avatar da Cloudinary
                    await cloudinary.uploader.destroy(publicId);
                } catch (cloudinaryError) {
                    // Se c'è un errore, lo registro ma continuo con l'aggiornamento
                    console.error("Errore nell'eliminazione del vecchio avatar:", cloudinaryError);
                }
            }
            // Aggiorno il percorso del avatar con la nuova immagine
            authorData.avatar = req.file.path;
        }

        const updateAuthor = await Author.findByIdAndUpdate (
            req.params.id,
            req.authorData,
            { new: true }
        );
        if (!updateAuthor) {
            return res.status(404).json({ message: "Autore non trovato" })
        } else {
            res.json({ message: "Autore modificato" });
        }
        
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleteAuthor = await Author.findByIdAndDelete(req.params.id)
        if (!deleteAuthor) {
            return res.status(404).json({ message: "Autore non trovato" })
        } else {
            res.json({ message: "Autore eliminato" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET per che restituisce i post di un singolo autore
router.get('/:id/blogPost', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Autore non trovato' });
        }
        const {page = 1, limit = 5} = req.query
        const blogPost = await BlogPost.find({ author: author.email })
            .limit(limit)
            .skip((page - 1) * limit)
        res.json(blogPost)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH per modificare solo l' avatar /authors/:authorsId/avatar
router.patch('/:authorsId/avatar', cloudinaryUploader.single("avatar"), async (req, res) => {
    try {
        if(!req.file) {
            return res.status(404).json({ message: 'Nessun file caricato' })
        }
        const author = await Author.findById(req.params.authorsId);
        if (!author) {
            return res.status(404).json({ message: 'Autore non trovato' });
        }
       
        author.avatar = req.file.path;
        
        await author.save();
        res.json(author);

    } catch (err) {
        console.error("Errore durante l'aggiornamento del' avatar:", err);
        res.status(500).json({ message: "Errore interno del server" });
    }
});

export default router;